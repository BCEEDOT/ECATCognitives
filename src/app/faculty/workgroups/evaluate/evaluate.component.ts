import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup } from "../../../core/entities/faculty";
import { FacWorkgroupService } from "../../services/facworkgroup.service";

@Component({
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements OnInit {


  showComments: boolean = false;
  wgStatus: string = "tc-red-900";
  stratIncomplete: boolean = false;
  assessIncomplete: boolean = false;
  assessStatusIcon: string;
  stratStatusIcon: string;
  canReview: boolean = false;
  members: CrseStudentInGroup[];
  workGroup: WorkGroup;
  workGroup$: Observable<WorkGroup>;
  workGroupId: number;
  paramWorkGroupId: number;
  paramCourseId: number;
  private wgName: string;

  constructor(
    private route: ActivatedRoute,
    private facWorkGroupService: FacWorkgroupService,
    private location: Location,

  ) {

    this.workGroup$ = route.data.pluck('workGroup');

    this.route.params.subscribe(params => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.paramCourseId = +params['crsId'];

    });

  }

  ngOnInit() {
    this.workGroup$.subscribe(workGroup => {
      this.workGroup = workGroup;
      this.facWorkGroupService.facWorkGroup(this.workGroup);
      this.activate();
    });
  }

  activate() {
    this.workGroupId = this.workGroup.workGroupId;
    this.wgName = (this.workGroup.customName) ? `${this.workGroup.customName} [${this.workGroup.defaultName}]` : this.workGroup.defaultName;
    this.members = this.workGroup.groupMembers as CrseStudentInGroup[];

    this.members.sort((a: CrseStudentInGroup, b: CrseStudentInGroup) => {
      if (a.studentProfile.person.lastName > b.studentProfile.person.lastName) { return 1; }
      if (a.studentProfile.person.lastName < b.studentProfile.person.lastName) { return -1; }
      return 0;
    });

    this.assessIncomplete = this.members.some(mem => {
      if (!mem.statusOfStudent.assessComplete) { return true; }
      return false;
    });


    this.stratIncomplete = this.members.some(mem => {
      if (!mem.statusOfStudent.stratComplete) { return true; }
      return false;
    });


    this.assessStatusIcon = (this.assessIncomplete) ? "indeterminate_check_box": "check_box"; 
    this.stratStatusIcon = (this.stratIncomplete) ? "indeterminate_check_box": "check_box"; 

  }

}
