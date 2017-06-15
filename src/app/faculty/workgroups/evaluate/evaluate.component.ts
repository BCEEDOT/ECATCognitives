import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { TdDialogService } from "@covalent/core";
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup } from "../../../core/entities/faculty";
import { FacWorkgroupService } from "../../services/facworkgroup.service";
import { MpSpStatus } from "../../../core/common/mapStrings";

@Component({
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements OnInit {


  showComments: boolean = false;
  wgStatus: string = "tc-red-900";
  stratIncomplete: boolean = true;
  assessIncomplete: boolean = true;
  commentIncomplete: boolean = true;
  assessStatusIcon: string;
  stratStatusIcon: string;
  commentStatusIcon: string = 'lock';
  canReview: boolean = false;
  members: CrseStudentInGroup[];
  workGroup: WorkGroup;
  workGroup$: Observable<WorkGroup>;
  workGroupId: number;
  paramWorkGroupId: number;
  paramCourseId: number;
  private wgName: string;
  private reviewBtnText: string = 'Review';

  constructor(
    private route: ActivatedRoute,
    private facWorkGroupService: FacWorkgroupService,
    private location: Location,
    private dialogService: TdDialogService,
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

    switch(this.workGroup.mpSpStatus){
      case MpSpStatus.created:
      case MpSpStatus.open:
        this.reviewBtnText = 'Review';
        this.canReview = this.workGroup.canPublish;
        break;
      case MpSpStatus.underReview:
        this.reviewBtnText = 'Complete';
        if (!this.assessIncomplete && !this.stratIncomplete){
          this.canReview = true;
        }
        this.showComments = true;
        if (this.workGroup.spComments.length > 0) {
          this.commentIncomplete = this.workGroup.spComments.some(com => com.flag.mpFaculty === null);
        } else {
          this.commentIncomplete = true;
        }
        this.commentStatusIcon = (this.commentIncomplete) ? "indeterminate_check_box": "check_box";
        break;
      case MpSpStatus.reviewed:
        this.reviewBtnText = 'Re-review';
        this.canReview = true;
        break;
      case MpSpStatus.published:
        this.canReview = false;
        break;
    }

    this.assessStatusIcon = (this.assessIncomplete) ? "indeterminate_check_box": "check_box"; 
    this.stratStatusIcon = (this.stratIncomplete) ? "indeterminate_check_box": "check_box"; 

  }

  reviewFlight() {
    let message: string;
    let title: string;

    if (!this.canReview){
      switch(this.workGroup.mpSpStatus){
        case MpSpStatus.created:
          message = 'Group has not yet been opened to students.'
          title = 'Cannot Review Group';
          break;
        case MpSpStatus.open:
          message = 'All students have have all assessments and strats complete. Check group status screen for more information.';
          title = 'Cannot Review Group';
          break;
        case MpSpStatus.underReview:
          message = 'You must complete all assessments and strats on all students and review all comments before marking your review as complete.'
          title = 'Cannot Complete Review';
          break;
        case MpSpStatus.published:
          message = 'Group results have already been published.';
          title = 'Cannot Re-Review Group';
          break;
        default:
          message = 'Group status cannot be changed at this time.';
          title = 'Cannot Change Status';
      }

      this.dialogService.openAlert({
        message: message,
        title: title
      });
      
    } else {
      switch(this.workGroup.mpSpStatus){
        case MpSpStatus.open:
          message = 'Students will no longer be able to make changes to assessments/comments/strats. \n\n Are you sure you want to place this flight Under Review?';
          title = 'Review Group';
          break;
        case MpSpStatus.underReview:
          message = 'This will set the group as Reviewed and allow the ISA to Publish results. \n\n Are you sure you are done with your review?';
          title = 'Complete Review';
          break;
        case MpSpStatus.reviewed:
          message = 'This will set the group back to Under Review so you can change assessments/strats/comment flags. Are you sure you want to re-review?';
          title = 'Re-Review Group';
          break;
      }

      this.dialogService.openConfirm({
          message: message,
          title: title,
          acceptButton: 'Yes',
          cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {

        }
      });
    }
  }
}
