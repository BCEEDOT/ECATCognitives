import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MdSnackBar } from "@angular/material";
import { TdDialogService } from "@covalent/core";
import { EntityAction } from 'breeze-client';
import 'rxjs/add/operator/pluck';
import { Observable } from "rxjs/Observable";
import { DragulaService } from "ng2-dragula";

import { LmsadminWorkgroupService } from "../../services/lmsadmin-workgroup.service";
import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";
import { WorkGroupModel, Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/lmsadmin";
import { MpSpStatus, MpGroupCategory } from "../../../core/common/mapStrings";

@Component({
  selector: 'app-manage-groupset',
  templateUrl: './manage-groupset.component.html',
  styleUrls: ['./manage-groupset.component.scss']
})


export class ManageGroupsetComponent implements OnInit {

  workGroups: WorkGroup[];
  workGroups$: Observable<WorkGroup[]>
  unassignedStudents: CrseStudentInGroup[];
  workGroupCategory: string;
  changes: Changes[] = [];
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  disabled = false;
  allExpanded: boolean = false;

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
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });

    //TODO: Subscribe to the entityChanged event if the original value matches the old changed value reject the change.
    //http://breeze.github.io/doc-js/lap-changetracking.html

    this.lmsadminDataContext.entityChanged.subscribe(value => {

      console.log(value);
      let action = value.entityAction;

      if (action === EntityAction.PropertyChange) {
        var entity = value.entity;
        var propertyName = value.args.propertyName;
        var newValue =value.args.newValue;
        var oldValue = value.args.oldValue;

        if (newValue === entity.entityAspect.originalValues.workGroupId) {
          console.log("HEY DUDE THEY CHANGED IT BACK REJECT THAT CHANGE FOOOOOOL!!!!");
        }
        console.log(newValue);
        console.log(oldValue);

        console.log(entity);
        console.log(propertyName);
      }



    })
  }

  ngOnInit() {

    this.workGroups$.subscribe(workGroups => {
      this.workGroups = workGroups;
      this.activate();
    });


  }

  activate(): void {

    this.workGroups = this.workGroups.filter(wg => wg.mpCategory === this.workGroupCategory);

    this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
      if (+wgA.groupNumber < +wgB.groupNumber) return -1;
      if (+wgA.groupNumber > +wgB.groupNumber) return 1;
      return 0;
    });

    this.workGroups.forEach(workGroup => {
      workGroup['isExpanded'] = false;
    });

    console.log(this.workGroups);

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

  save(): void {
    console.log(this.workGroups);
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
    // console.log(args);
    let studentId = args[0].id;
    let toGroupId = args[1].id;
    let fromGroupId = args[2].id;
    console.log('Student id - ' + args[0].id);
    console.log('Student went to -' + args[1].id);
    console.log('Student is from -' + args[2].id);

    this.workGroups.filter(wg => wg.workGroupId === +toGroupId)[0].groupMembers.push(

      this.workGroups.filter(wg => wg.workGroupId === +fromGroupId)[0].groupMembers.filter(gm => gm.studentId === +studentId)[0]);

    let toGroup = this.workGroups.filter(wg => wg.workGroupId === +toGroupId).slice();
    let fromGroup = this.workGroups.filter(wg => wg.workGroupId === +fromGroupId).slice();
    let studentFrom = fromGroup[0].groupMembers.filter(gm => gm.studentId === +studentId).slice();
    let studentTo = toGroup[0].groupMembers.filter(gm => gm.studentId === +studentId).slice();
    // console.log(toGroup);
    // console.log(fromGroup);
    // console.log(studentFrom);
    // console.log(studentTo);

    console.log(this.lmsadminDataContext.getChanges());
    console.log(this.lmsadminDataContext.hasChanges());




    // let changedStudent = new Changes(student, fromGroup, toGroup);
    // this.changes.push(changedStudent);
    // console.log(this.changes);

  }

}

export class Changes {

  student: CrseStudentInGroup;
  from: WorkGroup;
  to: WorkGroup;

  constructor(student: CrseStudentInGroup, from: WorkGroup, to: WorkGroup) {
    this.student = student;
    this.from = from;
    this.to = to;
  }
}
