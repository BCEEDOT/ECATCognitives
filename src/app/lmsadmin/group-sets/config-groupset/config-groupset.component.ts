import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MdSnackBar } from "@angular/material";

import { TdLoadingService, TdDialogService } from "@covalent/core";

import { WorkGroupModel, WorkGroup } from "../../../core/entities/lmsadmin/index";
import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";
import { LmsadminWorkgroupService } from "../../services/lmsadmin-workgroup.service";
import { MpGroupCategory } from "../../../core/common/mapStrings";

@Component({
  selector: 'app-config-groupset',
  templateUrl: './config-groupset.component.html',
  styleUrls: ['./config-groupset.component.scss']
})
export class ConfigGroupsetComponent implements OnInit {
  wgCat: string;
  courseId: number;
  models: Array<WorkGroupModel>;
  currentModel: WorkGroupModel;
  previousModel: WorkGroupModel;
  reuseFlights: boolean = true;
  newFlights: boolean = false;
  keepNames: boolean = true;
  keepSizes: boolean = true;
  maxSize: number = 16;
  numFlights: number = 20;
  finalFlight: boolean = true;
  disabled: boolean = false;

  constructor(private lmsAdminDataCtx: LmsadminDataContextService,
    private LmsadminWorkGroupService: LmsadminWorkgroupService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.wgCat = params['catId'];
      this.courseId = params['crsId'];
      this.models = this.LmsadminWorkGroupService.workGroupModels$.value;
      this.activate();
    });
  }

  activate() {
    //this is a really ugly way to find the previous model and if we are doing the final group...
    this.models.sort((a: WorkGroupModel, b: WorkGroupModel) => {
      if (a.mpWgCategory < b.mpWgCategory) {return -1;}
      if (a.mpWgCategory > b.mpWgCategory) {return 1;}
    });

    for (let i = 0; i < this.models.length; i++) {
      if (this.models[i].mpWgCategory === this.wgCat) {
        if (i === 0){
          //shouldn't even be able to get here for BC1...
          this.router.navigate(['../..'], {relativeTo: this.route});
        }

        this.currentModel = this.models[i];

        if (i === this.models.length - 1){
          this.finalFlight = true;
          this.previousModel = this.models.filter(mdl => mdl.mpWgCategory === MpGroupCategory.bc1)[0];
        } else {
          this.finalFlight = false;
          this.previousModel = this.models[i - 1];
        }

        break;
      }
    }

    if (this.previousModel.workGroups.length === 0) {
      this.dialogService.openAlert({message: 'There must be groups in ' + this.previousModel.mpWgCategory + ' ' + this.previousModel.name + ' before creating groups in ' + this.currentModel.mpWgCategory + ' ' + this.currentModel.name, title: 'Cannot Create Groups'}).afterClosed().subscribe(_ => {this.router.navigate(['../..'], {relativeTo: this.route});});
      return;
    }
    
    this.lmsAdminDataCtx.fetchAllCourseMembers(this.courseId);
  }

  reuseCheck(){
    this.newFlights = this.reuseFlights;
  }

  newCheck(){
    this.reuseFlights = this.newFlights;
  }

  scatter(){
    this.loadingService.register();

    // if (this.finalFlight) {
    //   this.previousModel = this.models.filter(mdl => mdl.mpWgCategory === MpGroupCategory.bc1)[0];
    // } 

    this.lmsAdminDataCtx.fetchAllGroupSetMembers(this.courseId, this.previousModel.mpWgCategory).then(_ => { 
      let neededSlots: number = 0;
      this.previousModel.workGroups.forEach(grp => neededSlots += grp.groupMembers.length);

      if (this.reuseFlights && !this.keepSizes){
        if (neededSlots > (this.previousModel.workGroups.length * this.maxSize)){
          this.dialogService.openAlert({message: 'You need ' + neededSlots + ' membership openings, but only have ' + (this.previousModel.workGroups.length * this.maxSize) + ' available. Please adjust your flights and max sizes.', title: 'Configuration Error'});
          this.loadingService.resolve();
          return;
        }
      }

      if (this.newFlights) {
        if (neededSlots > (this.numFlights * this.maxSize)){
          this.dialogService.openAlert({message: 'You need ' + neededSlots + ' membership openings, but only have ' + (this.numFlights * this.maxSize) + ' available. Please adjust your flights and max sizes.', title: 'Configuration Error'});
          this.loadingService.resolve();
          return;
        }
      }

      this.createNewFlights(); 
    });
  }

  createNewFlights(){
    if (this.reuseFlights){
        this.previousModel.workGroups.forEach(grp => {
          let newGroup: WorkGroup;
          if (this.keepNames) {
            newGroup = this.lmsAdminDataCtx.createWorkgroup(this.courseId,this.currentModel.id, this.currentModel.mpWgCategory,grp.groupNumber,grp.defaultName, grp.customName);      
          } else {
            newGroup = this.lmsAdminDataCtx.createWorkgroup(this.courseId,this.currentModel.id, this.currentModel.mpWgCategory,grp.groupNumber,grp.defaultName, null);
          }

          if (this.keepSizes){
            newGroup.maxSize = grp.groupMembers.length;
          } else {
            newGroup.maxSize = this.maxSize;
          }
        })
      } else {
        for (let i = 1; i <= this.numFlights; i++) {
          let newGroup: WorkGroup;
          let flightNum: string;
          if (i < 10){
            flightNum = '0' + i.toString();
          } else {
            flightNum = i.toString();
          }
          newGroup = this.lmsAdminDataCtx.createWorkgroup(this.courseId,this.currentModel.id, this.currentModel.mpWgCategory,flightNum,'Flight ' + flightNum, null);
          newGroup.maxSize = this.maxSize;
        }
      }

      if (this.finalFlight) {
        this.copyStudents();
      } else {
        this.scatterStudents();
      }
  }

  scatterStudents(){
    //randomize the new groups just to make it appear even more scattered
    let groups = this.currentModel.workGroups.sort((a: WorkGroup, b:WorkGroup) => {
      if (Math.random()) {return -1;}
      return 1;
      // if (a.groupNumber < b.groupNumber) {return -1;}
      // if (a.groupNumber > b.groupNumber) {return 1;}
    })

    //to be used for index for the array of new groups
    let newGrpInd = 0;
    this.previousModel.workGroups.forEach(grp => {
      grp.groupMembers.forEach(mem => {
        //if newGrpInd is the index for a group that has a slot for a member, put them there
        if (newGrpInd !== groups.length && groups[newGrpInd].groupMembers.length < groups[newGrpInd].maxSize && groups[newGrpInd].maxSize !== 0) {
          this.lmsAdminDataCtx.createGroupMembership(groups[newGrpInd], mem.studentId);
          newGrpInd++;
        } else {
          //we need to find a group with an available slot
          for (let i = newGrpInd; i < (groups.length + newGrpInd); i++) {
            if (i === groups.length) {
              let found: boolean = false;
              //if we are past the last group, we need to start over from the beginning of the array
              for (let i2 = 0; i2 < groups.length; i2++) {
                if (groups[i2].groupMembers.length < groups[i2].maxSize) { 
                  i = i2; 
                  found = true;
                  break; 
                }
              }
              //if the above loop found a group we can use, set our main index
              if (found) {
                newGrpInd = i;
                break;
              } else {
                //we have a member, but no groups with space, not good
                this.cleanUpOnError('Could not find a group with an open slot for a member.');
              }
            } else {
              //if we are on a good group index, check if it has room
              if (groups[i].groupMembers.length < groups[i].maxSize && groups[i].maxSize !== 0){
                newGrpInd = i;
                break;
              } else {
                continue;
              }
            }
          }

          this.lmsAdminDataCtx.createGroupMembership(groups[newGrpInd], mem.studentId);
          newGrpInd++;
        }
        
      })
    })

    this.lmsAdminDataCtx.commit().then(res => {
      if (res){
        this.loadingService.resolve();
        this.snackBar.open('Groups and memberships created!', 'Dismiss');
        this.router.navigate(['../manage'], {relativeTo: this.route});
      }
    }, res => {
      this.cleanUpOnError(res);
    })
    .catch(res => {
      this.cleanUpOnError(res);
    });
  }

  copyStudents(){
    this.previousModel.workGroups.forEach(grp => {
      let newGroup = this.currentModel.workGroups.filter(newGrp => newGrp.groupNumber === grp.groupNumber)[0];

      grp.groupMembers.forEach(mem => {
        if (newGroup.course.students.filter(stu => stu.studentPersonId === mem.studentId)[0] !== null){
          this.lmsAdminDataCtx.createGroupMembership(newGroup, mem.studentId);
        }
      });
    });

    this.lmsAdminDataCtx.commit().then(res => {
      if (res){
        this.loadingService.resolve();
        this.snackBar.open('Groups and memberships created!', 'Dismiss');
        this.router.navigate(['../manage'], {relativeTo: this.route});
      }
    }, res => {
      this.cleanUpOnError(res);
    })
    .catch(res => {
      this.cleanUpOnError(res);
    });
  }

  cleanUpOnError(res: any){
    //we want to detach all of these group and group member entities so that they don't cause problems elsewhere
    this.loadingService.resolve();
    console.log('Groupset Group Creation Error: ' + res);
    this.currentModel.workGroups.forEach(grp => {
      grp.groupMembers.forEach(mem => mem.entityAspect.setDetached())
      grp.entityAspect.setDetached();
    })
    this.dialogService.openAlert({message: 'Please reload the page and try again.', title: 'Error Creating Groups'});
  }
}
