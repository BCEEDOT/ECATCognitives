import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { TdDialogService } from "@covalent/core";
import { EntityAction } from 'breeze-client';
import 'rxjs/add/operator/pluck';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { DragulaService } from "ng2-dragula";
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';

import { MpEntityType, MpGroupCategory, MpSpStatus } from '../../../core/common/mapStrings';
import { Course, CrseStudentInGroup, WorkGroup } from '../../../core/entities/lmsadmin';
import { LmsadminDataContextService } from '../../services/lmsadmin-data-context.service';
import { LmsadminWorkgroupService } from '../../services/lmsadmin-workgroup.service';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { AddGroupDialogComponent } from "./add-group-dialog/add-group-dialog.component";

@Component({
  selector: 'app-manage-groupset',
  templateUrl: './manage-groupset.component.html',
  styleUrls: ['./manage-groupset.component.scss']
})


export class ManageGroupsetComponent implements OnInit {

  workGroups: WorkGroup[];
  origWorkGroups: WorkGroup[];
  workGroups$: Observable<WorkGroup[]>
  courseId: number;
  unassigned: string = "unassigned";
  changes = [];
  unassignedStudents: CrseStudentInGroup[] = [];
  flights: number[] = [];
  workGroupCategory: string;
  disabled = false;
  allExpanded: boolean = false;
  searchInputTerm: string;
  editDialogRef: MdDialogRef<EditGroupDialogComponent>;
  addDialogRef: MdDialogRef<AddGroupDialogComponent>;

  constructor(private lmsadminDataContext: LmsadminDataContextService,
    private dragulaService: DragulaService,
    private lmsadminWorkGroupService: LmsadminWorkgroupService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private snackBar: MdSnackBar,
    public editDialog: MdDialog, @Inject(DOCUMENT) editDoc: any,
    public addDialog: MdDialog, @Inject(DOCUMENT) addDoc: any) {

    this.workGroups$ = route.data.pluck('groupSetMembers');

    this.route.params.subscribe(params => {
      this.workGroupCategory = params['catId'];
      this.courseId = params['crsId'];
    });

    dragulaService.drag.subscribe((value) => {
      // console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      // console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      // console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      // console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });

    this.lmsadminDataContext.entityChanged.subscribe(value => {

      let action = value.entityAction;

      if (action === EntityAction.PropertyChange) {
        var entity = value.entity;
        var propertyName = value.args.propertyName;
        var newValue = value.args.newValue;
        var oldValue = value.args.oldValue;

        if (newValue === entity.entityAspect.originalValues.workGroupId) {
          entity.entityAspect.rejectChanges();
        }

        if (propertyName === "isDeleted" && oldValue) {
          if (!entity.entityAspect.originalValues.workGroupId) {
            entity.entityAspect.rejectChanges();
          }
        }

        this.changes = this.lmsadminDataContext.getChanges();

      }

    })
  }

  ngOnInit() {

    this.workGroups$.subscribe(workGroups => {
      this.workGroups = workGroups;
      this.activate();
    });

    console.log(this.workGroups);

  }

  addGroup(): void {

    //Required in database WgModelId, CourseId, isPrimary
    let initial = {
      courseId: this.workGroups[0].courseId,
      defaultName: '',
      customName: '',
      groupNumber: '',
      isPrimary: true,
      assignedSpInstrId: this.workGroups[0].assignedSpInstrId,
      mpCategory: this.workGroupCategory,
      mpSpStatus: "Open",
      wgModelId: this.workGroups[0].wgModelId,
      //workGroupId: 93838 //How does this get created?
    } as WorkGroup;

    let workGroup = this.lmsadminDataContext._manager.createEntity('WorkGroup', initial) as WorkGroup;

    this.addDialogRef = this.addDialog.open(AddGroupDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      width: '325px',
      height: '',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        workGroup: workGroup
      }
    });

    this.addDialogRef.afterClosed().subscribe(workGroup => {
      if (workGroup) {

        let groupName = workGroup.defaultName.toLowerCase();

        if (workGroup.entityAspect.entityState.isAdded()) {

          workGroup.changeDescription = `${workGroup.defaultName} added`;
          this.flights[workGroup.workGroupId] = workGroup.defaultName;
          this.workGroups.push(workGroup);

        }

      }
    })
  }


  editGroup(group: WorkGroup): void {
    this.editDialogRef = this.editDialog.open(EditGroupDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      width: '325px',
      height: '',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        workGroup: group
      }
    });

    this.editDialogRef.afterClosed().subscribe(workGroup => {
      if (workGroup) {

        let groupName = workGroup.defaultName.toLowerCase();

        if (workGroup.entityAspect.entityState.name !== "Modified") {

          workGroup.groupMembers.forEach(gm => {
            gm.isDeleted = true;
            //Check if student is being move to unassigned from newly added flight
            if (gm.workGroupId < 0) {
              gm.changeDescription = `${gm.rankName} moved from ${this.flights[gm.entityAspect.originalValues.workGroupId]} to unassigned`;
            } else {
              gm.changeDescription = `${gm.rankName} moved from ${groupName} to unassigned`;
            }
            this.unassignedStudents.push(gm);
          });

          if (workGroup.entityAspect.entityState.name === "Added") {
            workGroup.entityAspect.rejectChanges();
          } else {
            workGroup.entityAspect.setDeleted();
            workGroup.changeDescription = `${workGroup.defaultName} deleted`;
          }


          this.workGroups = this.workGroups.filter(wg => wg.workGroupId !== workGroup.workGroupId);
        }

        this.changes = this.lmsadminDataContext.getChanges();

      }
    })
  }

  undoChange(change: any) {
    //Change can be a CrseStudentinGroup or WorkGroup
    let workGroupId: number = change.workGroupId;

    //Group will return undefined if it is deleted
    let group = this.workGroups.filter(wg => wg.workGroupId === workGroupId)[0];

    if (group) {

      if (change.isDeleted) {
        this.unassignedStudents = this.unassignedStudents.filter(stu => stu.studentId !== change.studentId);
        group.groupMembers.push(change);
        change.entityAspect.rejectChanges();
      }

      if (change.entityAspect.entity instanceof WorkGroup) {
        if (change.groupMembers.length === 0) {
          this.workGroups = this.workGroups.filter(wg => wg.workGroupId !== change.workGroupId);
          change.entityAspect.rejectChanges();
        } else {
          if (change.entityAspect.entityState.name === "Modified") {
            change.entityAspect.rejectChanges();
          } else {

            this.dialogService.openConfirm({
              message: 'Are you sure you want to delete this flight? All students will be placed in unassigned.',
              title: 'Delete Flight',
              acceptButton: 'Yes',
              cancelButton: 'No'
            }).afterClosed().subscribe((confirmed: boolean) => {
              if (confirmed) {
                change.groupMembers.forEach(gm => {
                  gm.isDeleted = true;
                  gm.changeDescription = `${gm.rankName} moved from ${this.flights[gm.entityAspect.originalValues.workGroupId]} to unassigned`;
                  this.unassignedStudents.push(gm);
                });

                this.workGroups = this.workGroups.filter(wg => wg.workGroupId !== change.workGroupId);
                change.entityAspect.rejectChanges();
                this.changes = this.lmsadminDataContext.getChanges();

              }
            });
          }
        }
      } else {
        if (change.entityAspect.originalValues.isDeleted) {
          this.unassignedStudents.push(change);
        }
        change.entityAspect.rejectChanges();
      }



    } else {

      //Change is a deleted workgroup
      if (change.entityAspect.entity instanceof WorkGroup) {
        change as WorkGroup;
        //workGroupId = change.workGroupId;
        change.entityAspect.rejectChanges();
        this.workGroups.push(change);
      } else {

        //Check if student was previously in an added group that has since been deleted
        if (group || change.workGroupId < 0) {
          this.unassignedStudents = this.unassignedStudents.filter(stu => stu.studentId !== change.studentId);
          change.entityAspect.rejectChanges();
        } else {

          this.dialogService.openAlert({ message: 'Flight must be restored first.', title: 'Failed to Undo Student' });
        }

      }


    }

    this.changes = this.lmsadminDataContext.getChanges();

  }

  activate(): void {
    console.log(this.workGroups);
    this.workGroups = this.workGroups.filter(wg => wg.mpCategory === this.workGroupCategory);

    this.getFlightNames();

    this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
      if (+wgA.groupNumber < +wgB.groupNumber) return -1;
      if (+wgA.groupNumber > +wgB.groupNumber) return 1;
      return 0;
    });

    this.workGroups.forEach(workGroup => {
      workGroup['isExpanded'] = false;
    });

    this.workGroups.forEach(wg => {
      let deletedMembers = wg.groupMembers.filter(gm => gm.isDeleted === true);

      deletedMembers.forEach(dm => {
        this.unassignedStudents.push(dm);
        dm.workGroup = null;
        dm.workGroupId = 1000;
        dm.entityAspect.setUnchanged();
      });



    });

    this.changes = this.lmsadminDataContext.getChanges();

    console.log(this.unassignedStudents);
    console.log(this.lmsadminDataContext.getChanges());

  }

  getFlightNames(): void {
    this.workGroups.forEach(wg => {
      this.flights[wg.workGroupId.toString()] = wg.defaultName;
    })

  }

  expandOrCollapseAll() {
    if (this.allExpanded) {
      this.workGroups.forEach(workGroup => {
        workGroup['isExpanded'] = true;
      });
    } else {
      this.workGroups.forEach(workGroup => {
        workGroup['isExpanded'] = false;
      });
    }
  }

  reset(): void {

    if (this.changes.length > 0) {

      this.dialogService.openConfirm({
        message: 'Are you sure you want to reset all students to original flights?',
        title: 'Discard Changes',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          if (this.changes) {
            this.lmsadminDataContext._manager.rejectChanges();
            this.lmsadminDataContext._manager.clear();
            this.lmsadminDataContext.fetchAllGroupSetMembers(this.courseId, this.workGroupCategory, true).then((workGroups: WorkGroup[]) => {
              this.unassignedStudents = [];
              this.changes = [];
              this.workGroups = workGroups;
              this.activate();
            })


          }
        }
      });

    } else {
      this.dialogService.openAlert({ message: 'No changes to discard.', title: 'Discard Changes' });
    }

  }

  save(): void {

    console.log(this.lmsadminDataContext.getChanges());
    console.log(this.unassignedStudents);

    if (this.changes.length > 0) {

      this.dialogService.openConfirm({
        message: 'Are you sure you want to save?',
        title: 'Save Changes',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.lmsadminDataContext.commit();
        }
      });

    } else {
      this.dialogService.openAlert({ message: 'No changes to save.', title: 'Save Changes' });
    }
  }

  clear(event: string) {
    this.searchInputTerm = '';
    this.workGroups.forEach(wg => {
      wg.groupMembers.forEach(gm => {
        gm['highlighted'] = false;
      })
    })

  }

  search(event: string): void {

    let studentsFound: number = 0;

    this.workGroups.forEach(wg => {
      let lastNameStudents: CrseStudentInGroup[];
      let firstNameStudents: CrseStudentInGroup[];
      wg['isExpanded'] = false;

      lastNameStudents = wg.groupMembers.filter(gm => {
        return gm.studentProfile.person.lastName.toLowerCase() === event.toLowerCase();
      });
      firstNameStudents = wg.groupMembers.filter(gm => {
        return gm.studentProfile.person.firstName.toLowerCase() === event.toLowerCase();
      });

      if (lastNameStudents) {
        studentsFound += lastNameStudents.length;

        lastNameStudents.forEach(student => {
          let workGroup = this.workGroups.filter(wg => wg.workGroupId === student.workGroupId)[0];
          workGroup['isExpanded'] = true;
          student['highlighted'] = true;
        })
      }

      if (firstNameStudents) {
        studentsFound += firstNameStudents.length
        firstNameStudents.forEach(student => {
          let workGroup = this.workGroups.filter(wg => wg.workGroupId === student.workGroupId)[0];
          workGroup['isExpanded'] = true;
          student['highlighted'] = true;
        })
      }

    })

    if (!studentsFound) {
      this.snackBar.open('No Students found', 'Dismiss', { duration: 3000 });
    }

  }

  hasClass(el: any, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  addClass(el: any, name: string) {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  removeClass(el: any, name: string) {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  onDrag(args) {
    let [e, el] = args;
    this.removeClass(e, 'ex-moved');
  }

  onDrop(args) {
    let [e, target, source] = args;
    this.addClass(e, 'ex-moved');
    this.trackChanges(args);
  }

  onOver(args) {
    let [e, el, container] = args;
    this.addClass(el, 'ex-over');
  }

  onOut(args) {
    let [e, el, container] = args;
    this.removeClass(el, 'ex-over');
  }

  trackChanges(args): void {
    let [e, target, source] = args;
    let studentId = args[0].id;
    let studentName = args[0].innerText;
    let toGroupId = args[1].id;
    let toGroupName: string;
    let fromGroupName: string;
    let fromGroupId = args[2].id;

    if (toGroupId === fromGroupId) {
      let student = this.workGroups.filter(wg => wg.workGroupId === +toGroupId)[0].groupMembers.find((gm) => {
        return gm.studentId === +studentId
      });
      student.entityAspect.rejectChanges();
      this.changes = this.lmsadminDataContext.getChanges();
    } else {

      if (toGroupId === this.unassigned) {
        toGroupName = this.unassigned;

        let unAssignedStudent = this.unassignedStudents.find((gm) => {
          return gm.studentId === +studentId;
        })


        if (unAssignedStudent.entityAspect.originalValues.workGroupId) {

          unAssignedStudent.changeDescription = `${unAssignedStudent.rankName} moved from ${this.flights[unAssignedStudent.entityAspect.originalValues.workGroupId]} to unassigned`;
        } else {
          unAssignedStudent.changeDescription = `${unAssignedStudent.rankName} moved from ${this.flights[+fromGroupId]} to unassigned`;
        }

        unAssignedStudent.isDeleted = true;

      } else {

        toGroupName = this.flights[toGroupId].toString();
      }

      if (fromGroupId === this.unassigned) {

        let assignedStudent = this.workGroups.filter(wg => wg.workGroupId === +toGroupId)[0].groupMembers.find((gm) => {
          return gm.studentId === +studentId
        })

        if (assignedStudent.isDeleted) {

          assignedStudent.isDeleted = false;
          this.changes = this.lmsadminDataContext.getChanges();
        }
        
        if (assignedStudent.entityAspect.originalValues.workGroupId !== 1000) {

          assignedStudent.changeDescription = `${assignedStudent.rankName} moved from ${this.flights[assignedStudent.entityAspect.originalValues.workGroupId]} to ${this.flights[+toGroupId]}`;
        } else {
          assignedStudent.changeDescription = `${assignedStudent.rankName} moved from unassigned to ${this.flights[+toGroupId]}`;
          
        }
      }

      if (toGroupId !== this.unassigned && fromGroupId !== this.unassigned) {
        let student = this.workGroups.filter(wg => wg.workGroupId === +toGroupId)[0].groupMembers.find((gm) => {
          return gm.studentId === +studentId
        });
        student.changeDescription = `${student.rankName} moved from ${this.flights[+fromGroupId]} to ${this.flights[+toGroupId]}`;
      }

      this.snackBar.open(`${studentName} has been moved to ${toGroupName}`, 'Dismiss', { duration: 2000 });
    }

    console.log(this.lmsadminDataContext.getChanges())

  }

}



