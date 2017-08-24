import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { TdDialogService, TdLoadingService } from "@covalent/core";
import { EntityAction } from 'breeze-client';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/takeUntil';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { DragulaService } from "ng2-dragula";
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';

import { MpEntityType, MpGroupCategory, MpSpStatus } from '../../../core/common/mapStrings';
import { Course, CrseStudentInGroup, WorkGroup, StudentInCourse } from '../../../core/entities/lmsadmin';
import { LmsadminDataContextService } from '../../services/lmsadmin-data-context.service';
import { LmsadminWorkgroupService } from '../../services/lmsadmin-workgroup.service';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { AddGroupDialogComponent } from "./add-group-dialog/add-group-dialog.component";

@Component({
  selector: 'app-manage-groupset',
  templateUrl: './manage-groupset.component.html',
  styleUrls: ['./manage-groupset.component.scss']
})

export class ManageGroupsetComponent implements OnInit, OnDestroy {

  workGroups: WorkGroup[];
  course: Course;
  course$: Observable<Course>;
  //origWorkGroups: WorkGroup[];
  workGroups$: Observable<WorkGroup[]>
  //courseMembers: StudentInCourse[];
  courseId: number;
  unassigned: string = "unassigned";
  changes = [];
  unassignedStudents: CrseStudentInGroup[] = [];
  flights: number[] = [];
  workGroupCategory: string;
  allExpanded: boolean = false;
  searchInputTerm: string;
  editDialogRef: MdDialogRef<EditGroupDialogComponent>;
  addDialogRef: MdDialogRef<AddGroupDialogComponent>;
  ngUnsubscribe: Subject<any> = new Subject<any>();
  usedFlightNumbers: string[] = [];
  isUnassignedPanelExpanded: boolean = false;
  readOnly: boolean = false;
  canSaveFlag: boolean = true;
  newGroupStatus: string;
  assignedSpInstrumentId: number;
  workGroupModelId: number;
  testStatus = {
    await: 'Awaiting Creation',
    created: 'Created',
    inUse: 'In Use',
    reviewed: 'Reviewed',
    pub: 'Published',
  };

  constructor(private lmsadminDataContext: LmsadminDataContextService,
    private dragulaService: DragulaService,
    private lmsadminWorkGroupService: LmsadminWorkgroupService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService,
    private snackBar: MdSnackBar,
    public editDialog: MdDialog, @Inject(DOCUMENT) editDoc: any,
    public addDialog: MdDialog, @Inject(DOCUMENT) addDoc: any) {

    this.workGroups$ = route.data.pluck('groupSetMembers');
    this.course$ = route.data.pluck('courseMembers');

    this.route.params.subscribe(params => {

      this.workGroupCategory = params['catId'];
      this.courseId = params['crsId'];
    });

    dragulaService.drop.takeUntil(this.ngUnsubscribe)
      .subscribe((value) => {
        // console.log(`drop: ${value[0]}`);
        this.onDrop(value.slice(1));
      });

    this.lmsadminDataContext.entityChanged.takeUntil(this.ngUnsubscribe).subscribe(value => {

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

  activate(): void {

    if (this.workGroupCategory === MpGroupCategory.bc1) {
      this.readOnly = true;
      this.isUnassignedPanelExpanded = true;
    }



    this.workGroups = this.workGroups.filter(wg => wg.mpCategory === this.workGroupCategory);
    let courseMembers = this.course.students;
    console.log(courseMembers);
    let count: number = 0;
    let groupMembers = this.course.studentInCrseGroups.filter(sicg => {
      //When going in and out of groups. Student entities not maching category will
      //not have a workgroup object. 
      if (sicg.workGroup) {
        return sicg.workGroup.mpCategory === this.workGroupCategory
      }
    });

    console.log(`Number of course members - ${courseMembers.length}`);
    console.log(`Number of group members - ${groupMembers.length}`);

    let courseStudentsWithNoGroup = courseMembers.filter(cm => !groupMembers.some(gm => gm.studentId === cm.studentPersonId));

    if (courseStudentsWithNoGroup.length > 0) {
      courseStudentsWithNoGroup.forEach(csng => {
        let courseStudentWithNoGroup = this.lmsadminDataContext.createCrseStudentInGroup(csng);
        courseStudentWithNoGroup.entityAspect.setUnchanged();
        courseStudentWithNoGroup.notAssignedToGroup = true;
        this.unassignedStudents.push(courseStudentWithNoGroup);
      })
    };

    this.getFlightNames();

    this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
      if (+wgA.groupNumber < +wgB.groupNumber) return -1;
      if (+wgA.groupNumber > +wgB.groupNumber) return 1;
      return 0;
    });

    this.workGroups.forEach(workGroup => {
      workGroup['isExpanded'] = false;
      workGroup['canEdit'] = false;
      if (workGroup.mpSpStatus === MpSpStatus.open || workGroup.mpSpStatus === MpSpStatus.created) {
        workGroup['canEdit'] = true;
      }

    });

    this.changes = this.lmsadminDataContext.getChanges();

  }

  ngOnInit() {

    //Wait for both observables to emit a value before continuing.
    this.workGroups$.zip(this.course$).takeUntil(this.ngUnsubscribe).subscribe(data => {
      this.workGroups = data[0];
      this.course = data[1];
      this.activate();
    });

    this.groupSetInfo();
  }

  ngOnDestroy() {
    //Clean up the drop subscription to prevent errors. 
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  changesToSave(): boolean {
    return this.lmsadminDataContext.hasChanges();
  }

  groupSetInfo(): void {
    let workGroupModel = this.lmsadminWorkGroupService.workGroupModels$.value
      .filter(wgm => wgm.mpWgCategory === this.workGroupCategory)[0];

    this.workGroupModelId = workGroupModel.id;
    this.assignedSpInstrumentId = workGroupModel.assignedSpInstrId;

    switch (workGroupModel.status) {
      case this.testStatus.created:
        this.newGroupStatus = MpSpStatus.created;
        break;
      case this.testStatus.inUse:
        this.newGroupStatus = MpSpStatus.open;
        break;
      default:
        this.newGroupStatus = null;
    }

    console.log(workGroupModel);

  }

  addGroup(): void {

    //Required in database WgModelId, CourseId, isPrimary
    let initial = {
      courseId: +this.courseId,
      defaultName: '',
      customName: '',
      groupNumber: '',
      isPrimary: true,
      assignedSpInstrId: this.assignedSpInstrumentId,
      mpCategory: this.workGroupCategory,
      mpSpStatus: this.newGroupStatus,
      wgModelId: this.workGroupModelId,
    } as WorkGroup;

    let workGroup = this.lmsadminDataContext.createWorkGroup(initial);

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
        workGroup: workGroup,
        usedFlightNumbers: this.usedFlightNumbers
      }
    });

    this.addDialogRef.afterClosed().subscribe(workGroup => {
      if (workGroup) {

        let groupName = workGroup.defaultName.toLowerCase();

        if (workGroup.entityAspect.entityState.isAdded()) {

          let saveArray = [];
          saveArray.push(workGroup);

          this.lmsadminDataContext.namedCommit(saveArray).then(() => {
            workGroup.changeDescription = `${workGroup.defaultName} added`;
            this.changes = this.lmsadminDataContext.getChanges();
            workGroup['canEdit'] = true;
            this.workGroups.push(workGroup);
            this.getFlightNames();
            this.snackBar.open('WorkGroup Created!', 'Dismiss', { duration: 2000 });

          }).catch((error) => {
            this.reset(true);
          });

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

        if (workGroup.entityAspect.entityState.name !== "Modified") {

          this.deleteWorkGroupMembers(workGroup);

          if (workGroup.entityAspect.entityState.name === "Added") {
            workGroup.entityAspect.rejectChanges();
          } else {
            workGroup.entityAspect.setDeleted();
            workGroup.changeDescription = `${workGroup.defaultName} deleted`;
          }

          this.workGroups = this.workGroups.filter(wg => wg.workGroupId !== workGroup.workGroupId);
        }

        if (workGroup.toDelete) {
          this.deleteWorkGroupMembers(workGroup);
          workGroup.entityAspect.setDeleted();
          workGroup.changeDescription = `${workGroup.defaultName} deleted`;
          this.workGroups = this.workGroups.filter(wg => wg.workGroupId !== workGroup.workGroupId);
        }


        this.changes = this.lmsadminDataContext.getChanges();

      }

      this.canSave();
    });
  }

  deleteWorkGroupMembers(workGroup: WorkGroup): void {

    let groupName = workGroup.defaultName.toLowerCase();

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
            this.canSave();
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
        if (change.notAssignedToGroup) {
          change.workGroupId = 0;
          change.entityAspect.setUnchanged();
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

  getFlightNames(): void {
    this.usedFlightNumbers = [];
    this.workGroups.forEach(wg => {
      this.flights[wg.workGroupId.toString()] = wg.defaultName;
      this.usedFlightNumbers.push(wg.groupNumber);
    });

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

  reset(force: boolean): void {

    console.log(force);
    if (this.changes.length > 0) {

      if (force) {
        this.startOver();
      } else {

        this.dialogService.openConfirm({
          message: 'Are you sure you want to reset all students to original flights?',
          title: 'Discard Changes',
          acceptButton: 'Yes',
          cancelButton: 'No'
        }).afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            if (this.changes) {
              this.startOver();
            }
          }
        });
      }

    } else {
      this.dialogService.openAlert({ message: 'No changes to discard.', title: 'Discard Changes' });
    }



  }

  startOver(): void {
    this.loadingService.register();
    this.lmsadminDataContext._manager.rejectChanges();
    this.lmsadminDataContext._manager.clear();
    let promise1 = this.lmsadminDataContext.fetchAllGroupSetMembers(this.courseId, this.workGroupCategory, true);
    let promise2 = this.lmsadminDataContext.fetchAllCourseMembers(this.courseId, true);

    Promise.all([promise1, promise2]).then(data => {
      this.unassignedStudents = [];
      this.changes = [];
      this.workGroups = data[0];
      this.course = data[1];
      console.log(data);
      this.loadingService.resolve();
      this.activate();
    });
  };

  canSave(): void {

    this.canSaveFlag = true;

    this.getFlightNames();

    const count = numbers =>
      numbers.reduce((a, b) =>
        Object.assign(a, { [b]: (a[b] || 0) + 1 }), {});

    const duplicates = dict =>
      Object.keys(dict).filter((a) => dict[a] > 1)

    let notUnique = duplicates(count(this.usedFlightNumbers));

    console.log(notUnique)

    if (notUnique.length > 0) {
      this.canSaveFlag = false;
    }

  }

  save(): void {

    console.log(this.unassignedStudents);
    console.log(this.lmsadminDataContext.getChanges());

    var deletedPromise: Promise<any>;
    var changedPromise: Promise<any>;
    var addedPromise: Promise<any>;
    var workGroupPromise: Promise<any>;

    if (this.changes.length > 0 && this.canSaveFlag) {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to save?',
        title: 'Save Changes',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.loadingService.register();
          let that = this;
          this.unassignedStudents.forEach(uas => {
            if (uas.isDeleted) {
              uas.entityAspect.rejectChanges();
              uas.entityAspect.setDeleted();
            }
          });

          let addedEntities = this.lmsadminDataContext.getChanges().filter(entities => {
            return entities.entityAspect.entityState.isAdded();
          });

          if (addedEntities.length > 0) {
            addedPromise = this.lmsadminDataContext.namedCommit(addedEntities);
          } else {
            addedPromise = Promise.resolve();
          }

          let deletedEntities = this.lmsadminDataContext.getChanges().filter(entities => {
            return entities.entityAspect.entityState.isDeleted();
          });

          if (deletedEntities.length > 0) {
            deletedPromise = this.lmsadminDataContext.namedCommit(deletedEntities);
          } else {
            deletedPromise = Promise.resolve();
          }

          let changedEntities = this.lmsadminDataContext.getChanges().filter(entities => {
            return entities.entityAspect.entityState.isModified();
          });

          if (changedEntities.length > 0) {
            changedPromise = this.lmsadminDataContext.namedCommit(changedEntities);
          } else {
            changedPromise = Promise.resolve();
          }

          Promise.all([deletedPromise, changedPromise, addedPromise]).then((message) => {
            this.loadingService.resolve();
            this.changes = this.lmsadminDataContext.getChanges();
            this.location.back();
            this.snackBar.open('All Changes Save', 'Dismiss', { duration: 2000 });
          }).catch((errors) => {
            this.loadingService.resolve();
            this.reset(true);
            that.dialogService.openAlert({ message: 'There was an error saving, please try again', title: 'Error' });
          });

        }
      });


    } else {
      if (!this.canSaveFlag) {
        this.dialogService.openAlert({ message: `Please correct and try again`, title: 'Duplicate Flight Numbers' });
      } else {
        this.dialogService.openAlert({ message: 'No changes to save.', title: 'Save Changes' });
      }
    }
  }

  clear(event: string) {
    this.searchInputTerm = '';

    this.unassignedStudents.forEach(student => {
      student['highlighted'] = false;
    });

    this.workGroups.forEach(wg => {
      wg.groupMembers.forEach(gm => {
        gm['highlighted'] = false;
      })
    })

  }

  search(event: string): void {

    let studentsFound: number = 0;

    this.unassignedStudents.forEach(uas => {
      let foundStudents: CrseStudentInGroup[] = [];

      if (uas.studentProfile.person.lastName.toLowerCase() === event.toLowerCase() ||
        uas.studentProfile.person.firstName.toLowerCase() === event.toLowerCase()) {
        foundStudents.push(uas);

      }

      if (foundStudents) {
        studentsFound += foundStudents.length;

        foundStudents.forEach(student => {
          this.isUnassignedPanelExpanded = true;
          uas['highlighted'] = true;
        });
      };
    });

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

  onDrop(args) {
    let [e, target, source] = args;
    //this.addClass(e, 'ex-moved');
    this.trackChanges(args);
  }

  trackChanges(args): void {
    let [e, target, source] = args;
    let studentId = args[0].id;
    let studentName = args[0].innerText;
    let toGroupId = args[1].id;
    let toGroupName: string;
    let fromGroupName: string;
    let fromGroupId = args[2].id;

    //Student is being moved moved around within the flight. Dragula extra feature.
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
        });

        if (unAssignedStudent.entityAspect.entityState.isModified()) {
          if (unAssignedStudent.entityAspect.originalValues.workGroupId) {
            unAssignedStudent.changeDescription = `${unAssignedStudent.rankName} moved from ${this.flights[unAssignedStudent.entityAspect.originalValues.workGroupId]} to unassigned`;
          } else {
            unAssignedStudent.changeDescription = `${unAssignedStudent.rankName} moved from ${this.flights[+fromGroupId]} to unassigned`;
          }

          unAssignedStudent.isDeleted = true;
        };

        if (unAssignedStudent.entityAspect.entityState.isAdded()) {
          unAssignedStudent.entityAspect.setUnchanged();
          this.changes = this.lmsadminDataContext.getChanges();
        };

      } else {

        toGroupName = this.flights[toGroupId].toString();
      }

      if (fromGroupId === this.unassigned) {

        let workgroup = this.workGroups.filter((wg) => {
          return wg.workGroupId === +toGroupId
        }
        )[0]

        let assignedStudent = workgroup.groupMembers.find((gm) => {
          return gm.studentId === +studentId
        });


        if (assignedStudent.isDeleted) {

          assignedStudent.isDeleted = false;
          this.changes = this.lmsadminDataContext.getChanges();
        }

        if (assignedStudent.notAssignedToGroup) {
          // if (assignedStudent.entityAspect.entityState.isDetached()) {
          //   assignedStudent.entityAspect.
          // }
          assignedStudent.entityAspect.setAdded();
          assignedStudent.changeDescription = `${assignedStudent.rankName} moved from unassigned to ${this.flights[+toGroupId]}`;
        } else {

          assignedStudent.changeDescription = `${assignedStudent.rankName} moved from ${this.flights[assignedStudent.entityAspect.originalValues.workGroupId]} to ${this.flights[+toGroupId]}`;

        }
      }

      if (toGroupId !== this.unassigned && fromGroupId !== this.unassigned) {
        let student = this.workGroups.filter(wg => wg.workGroupId === +toGroupId)[0].groupMembers.find((gm) => {
          return gm.studentId === +studentId
        });
        if (student.entityAspect.entityState.isAdded()) {
          student.changeDescription = `${student.rankName} moved from unassigned to ${this.flights[+toGroupId]}`;

        } else {
          student.changeDescription = `${student.rankName} moved from ${this.flights[+fromGroupId]} to ${this.flights[+toGroupId]}`;
        }
      }

      this.snackBar.open(`${studentName} has been moved to ${toGroupName}`, 'Dismiss', { duration: 2000 });
    }

  }

  // hasClass(el: any, name: string) {
  //   return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  // }

  // addClass(el: any, name: string) {
  //   if (!this.hasClass(el, name)) {
  //     el.className = el.className ? [el.className, name].join(' ') : name;
  //   }
  // }

  // removeClass(el: any, name: string) {
  //   if (this.hasClass(el, name)) {
  //     el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
  //   }
  // }

  // onDrag(args) {
  //   let [e, el] = args;
  //   this.removeClass(e, 'ex-moved');
  // }

  // onOver(args) {
  //   let [e, el, container] = args;
  //   this.addClass(el, 'ex-over');
  // }

  // onOut(args) {
  //   let [e, el, container] = args;
  //   this.removeClass(el, 'ex-over');
  // }



}



