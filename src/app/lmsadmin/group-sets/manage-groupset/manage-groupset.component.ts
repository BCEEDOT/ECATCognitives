import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MdSnackBar } from "@angular/material";
import { TdDialogService } from "@covalent/core";
import { EntityAction } from 'breeze-client';
import 'rxjs/add/operator/pluck';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { DragulaService } from "ng2-dragula";

import { MpEntityType, MpGroupCategory, MpSpStatus } from '../../../core/common/mapStrings';
import { Course, CrseStudentInGroup, WorkGroup, WorkGroupModel } from '../../../core/entities/lmsadmin';
import { LmsadminDataContextService } from '../../services/lmsadmin-data-context.service';
import { LmsadminWorkgroupService } from '../../services/lmsadmin-workgroup.service';

@Component({
  selector: 'app-manage-groupset',
  templateUrl: './manage-groupset.component.html',
  styleUrls: ['./manage-groupset.component.scss']
})


export class ManageGroupsetComponent implements OnInit {

  workGroups: WorkGroup[];
  workGroups$: Observable<WorkGroup[]>
  unassigned: string = "unassigned";
  changes = [];
  unassignedStudents: CrseStudentInGroup[] = [];
  flights: number[] = [];
  workGroupCategory: string;
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  disabled = false;
  allExpanded: boolean = false;
  searchInputTerm: string;

  constructor(private lmsadminDataContext: LmsadminDataContextService,
    private dragulaService: DragulaService,
    private lmsadminWorkGroupService: LmsadminWorkgroupService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private snackBar: MdSnackBar) {

    this.workGroups$ = route.data.pluck('groupSetMembers');

    this.route.params.subscribe(params => {
      this.workGroupCategory = params['catId'];
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

        // this.changes = this.lmsadminDataContext.getChanges();

        // this.changes.forEach(change => {
        //   if (change.entityAspect.entity instanceof CrseStudentInGroup) {
        //   }
        // });

        this.changes = this.lmsadminDataContext.getChanges();

      }

    })
  }

  ngOnInit() {

    this.workGroups$.subscribe(workGroups => {
      this.workGroups = workGroups;
      this.activate();
    });


  }

  undoChange(change: CrseStudentInGroup) {
    let workGroupId: number;
    if (change.isDeleted) {
      if (change.entityAspect.originalValues.workGroupId) {
        workGroupId = change.entityAspect.originalValues.workGroupId;
      } else {
        workGroupId = change.workGroupId;
      }
      this.unassignedStudents = this.unassignedStudents.filter(stu => stu.studentId !== change.studentId);
      this.workGroups.filter(wg => wg.workGroupId === workGroupId)[0].groupMembers.push(change);
    }
    change.entityAspect.rejectChanges();
    this.changes = this.lmsadminDataContext.getChanges();


  }

  activate(): void {
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
    console.log(this.lmsadminDataContext.getChanges());
    console.log(this.dragulaService.find("bag-one"));
    // this.lmsadminDataContext.rollback();
    // console.log(this.lmsadminDataContext.getChanges());
  }

  save(): void {
    console.log(this.workGroups);
    console.log(this.unassignedStudents);
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

    console.log(studentsFound);

    if (!studentsFound) {
      this.snackBar.open('No Students found', 'Dismiss', {duration: 3000});
    }



    // // let student = this.workGroups[0].groupMembers[0];
    // // let workGroup = this.workGroups.filter(wg => wg.workGroupId === student.workGroupId)[0];
    // console.log(workGroup);
    // workGroup['isExpanded'] = true;
    // console.log(student);
    // student['highlighted'] = true;
    // setTimeout(() => {
    //     student['highlighted'] = false;
    //   }, 3000)
  }

  private hasClass(el: any, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: any, name: string) {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el: any, name: string) {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  private onDrag(args) {
    let [e, el] = args;
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args) {
    let [e, target, source] = args;
    this.addClass(e, 'ex-moved');
    this.trackChanges(args);
  }

  private onOver(args) {
    let [e, el, container] = args;
    this.addClass(el, 'ex-over');
  }

  private onOut(args) {
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

        unAssignedStudent.isDeleted = true;
        unAssignedStudent['changeDescription'] = `${unAssignedStudent.rankName} moved from ${this.flights[+fromGroupId]} to unassigned`;

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

        assignedStudent['changeDescription'] = `${assignedStudent.rankName} moved from ${this.flights[assignedStudent.entityAspect.originalValues.workGroupId]} to ${this.flights[+toGroupId]}`;

      }

      if (toGroupId !== this.unassigned && fromGroupId !== this.unassigned) {
        let student = this.workGroups.filter(wg => wg.workGroupId === +toGroupId)[0].groupMembers.find((gm) => {
          return gm.studentId === +studentId
        });
        student['changeDescription'] = `${student.rankName} moved from ${this.flights[+fromGroupId]} to ${this.flights[+toGroupId]}`;
      }

      this.snackBar.open(`${studentName} has been moved to ${toGroupName}`, 'Dismiss', { duration: 2000 });
    }

  }

}



