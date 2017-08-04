import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MdSnackBar, MdDialog, MdDialogRef } from "@angular/material";
import { TdDialogService, TdLoadingService } from "@covalent/core";

import { LmsadminDataContextService } from "../services/lmsadmin-data-context.service";
import { WorkGroupModel, Course, WorkGroup } from "../../core/entities/lmsadmin";
import { MpSpStatus, MpGroupCategory } from "../../core/common/mapStrings";
import { LmsadminWorkgroupService } from "../services/lmsadmin-workgroup.service";
import { PollLmsDialog } from "./poll-lms-dialog/poll-lms-dialog.component";
import { ISaveGradesResult } from "../../core/entities/client-models";

@Component({
  selector: 'app-group-sets',
  templateUrl: './group-sets.component.html',
  styleUrls: ['./group-sets.component.scss']
})

export class GroupSetsComponent implements OnInit {
  wgModels: Array<WorkGroupModel>;
  course: Course;
  courses: Course[];
  testStatus = {
    await: 'Awaiting Creation',
    created: 'Created',
    inUse: 'In Use',
    reviewed: 'Reviewed',
    pub: 'Published',
  };
  catMap = MpGroupCategory;
  dialogRef: MdDialogRef<PollLmsDialog>;
  
  constructor(private lmsadminDataContext: LmsadminDataContextService, 
   private lmsadminWorkGroupService: LmsadminWorkgroupService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService,
    private snackBar: MdSnackBar,
    private dialog: MdDialog) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadingService.register();
      let courseId: number = +params['crsId'];
      let promise1 = this.lmsadminDataContext.fetchCourseModels(courseId);
      let promise2 = this.lmsadminDataContext.fetchAllCourses(false);

      Promise.all([promise1, promise2]).then(res => {
        this.loadingService.resolve();
        this.wgModels = res[0];
        this.courses = res[1];
        this.course = this.courses.filter(course => course.id === courseId)[0];
        this.lmsadminWorkGroupService.workGroupModels(this.wgModels);
        this.activate();
      })
    })

  }

  activate(){
    this.wgModels.forEach(mdl => {
      if (mdl.workGroups.some(grp => grp.mpSpStatus === MpSpStatus.created)) {
        mdl['status'] = this.testStatus.created;
        return;
      } 
      
      if (mdl.workGroups.some(grp => grp.mpSpStatus === MpSpStatus.published)) {
        mdl['status'] = this.testStatus.pub;
        return; 
      } 
      
      if (mdl.workGroups.length === 0) {
        mdl['status'] = this.testStatus.await;
        return;
      } 
      
      //if all statuses are reviewed
      if (!mdl.workGroups.some(grp => grp.mpSpStatus !== MpSpStatus.reviewed)) {
        mdl['status'] = this.testStatus.reviewed;
        return;
      } 
      
      if (mdl.workGroups.some(grp => grp.mpSpStatus === MpSpStatus.reviewed)){
        //have to go get group members to see if all groups with members are reviewed
        this.loadingService.register();
        this.lmsadminDataContext.fetchAllGroupSetMembers(this.course.id, mdl.mpWgCategory).then(res => {
          let grpsWithMems = mdl.workGroups.filter(grp => {
            if (grp.groupMembers.length === 0){
              return false;
            }
            if (grp.groupMembers.some(mem => !mem.isDeleted)){
              return true;
            }
          });

          this.loadingService.resolve();

          if (!grpsWithMems.some(grp => grp.mpSpStatus !== MpSpStatus.reviewed)) {
            mdl['status'] = this.testStatus.reviewed;
            return;
          } else {
            mdl['status'] = this.testStatus.inUse;
            return;
          }
        })
      }

      //if we somehow don't meet any of the above, just show in use
      mdl['status'] = this.testStatus.inUse;
    })
  }

  advance(model: WorkGroupModel){
    if (model['status'] === this.testStatus.created) {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to open ' + model.mpWgCategory + ' groups to students?',
        title: 'Open Groups',
        acceptButton: 'Yes',
        cancelButton: 'No',
      }).afterClosed().subscribe((confirmed: boolean) => {
        if(confirmed){
          model.workGroups.forEach(grp => {
            grp.mpSpStatus = MpSpStatus.open;
          })
          this.lmsadminDataContext.commit().then((fulfilled) => {
            this.snackBar.open(model.mpWgCategory + ' Status Updated!', 'Dismiss', {duration: 2000});
            this.activate();
          }, (rejected) => {
            this.dialogService.openAlert({message: 'There was a problem saving, please refresh data and try again.', title: 'Save Error'});
          });
        }
      });
    } else if (model['status'] === this.testStatus.reviewed) {
      let grpsWithMems = model.workGroups.filter(grp => {
            if (grp.groupMembers.length === 0){
              return false;
            }
            if (grp.groupMembers.some(mem => !mem.isDeleted)){
              return true;
            }
          });

      if (!grpsWithMems.some(grp => grp.mpSpStatus !== MpSpStatus.reviewed)){
        this.dialogService.openConfirm({
          message: 'Are you sure you want to publish ' + model.mpWgCategory + ' group results to students?',
          title: 'Publish Groups',
          acceptButton: 'Yes',
          cancelButton: 'No',
        }).afterClosed().subscribe((confirmed: boolean) => {
          if(confirmed){
            this.loadingService.register();
            model.workGroups.forEach(grp => {
              grp.mpSpStatus = MpSpStatus.published;
            })
            this.lmsadminDataContext.commit().then((fulfilled) => {
              this.snackBar.open(model.mpWgCategory + ' Groups Published!', 'Dismiss', {duration: 2000});
              this.loadingService.resolve();
              this.activate();
            }, (rejected) => {
              this.loadingService.resolve();
              this.dialogService.openAlert({message: 'There was a problem saving, please refresh data and try again.', title: 'Save Error'});
            });
          }
        });
      } else {
        this.dialogService.openAlert({message: 'Please refresh the page and try again.', title: 'Error Publishing Groups'});
      }
    }
  }

  refreshData() {
    //Todo Rewire to match oninit
    let courseId = this.wgModels[0].workGroups[0].courseId;
    this.lmsadminDataContext.fetchCourseModels(courseId, true).then((models: Array<WorkGroupModel>) => {
        this.wgModels = models;
        this.activate();
      });
  }

  pollLmsGroups() {
    this.dialog.open(PollLmsDialog, {
      disableClose: true,
      data: {
        courseId: this.course.id,
      }
    }).afterClosed().subscribe(() => {this.activate()});
  }

  syncGrades(model: WorkGroupModel){
    this.loadingService.register();
    let courseId = model.workGroups[0].courseId;
    this.lmsadminDataContext.syncBbGrades(courseId, model.mpWgCategory)
    .then((resp: ISaveGradesResult) => {
      this.loadingService.resolve();
      if (resp.success){
        this.dialogService.openAlert({message: resp.returnedScores + ' scores recorded in LMS', title: 'Grades Pushed'});
      } else {
        this.dialogService.openAlert({message: resp.message, title: 'Grade Push Error'});
      }
    });
  }

}
