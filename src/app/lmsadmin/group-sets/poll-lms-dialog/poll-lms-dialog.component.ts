import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from "@angular/material";

import { TdLoadingService } from "@covalent/core";

import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";
import { GroupReconResult, MemReconResult, GroupMemReconResult } from "../../../core/entities/lmsadmin/index";

@Component({
  selector: 'app-poll-lms-dialog',
  templateUrl: './poll-lms-dialog.component.html',
  styleUrls: ['./poll-lms-dialog.component.scss']
})
export class PollLmsDialog implements OnInit {
  courseId: number;
  enrollResult: MemReconResult;
  groupsResult: GroupReconResult;
  grpMemResults: Array<GroupMemReconResult> = [];
  enrollComplete: boolean = false;
  groupsComplete: boolean = false;
  grpMemsComplete: boolean = false;
  pollComplete: boolean = false;
  pollFail: boolean = false;
  failMessage: string;

  constructor(private lmsAdminDataCtx: LmsadminDataContextService,
    private loadingService: TdLoadingService, 
    private dialogRef: MdDialogRef<PollLmsDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.courseId = this.data.courseId;
    this.pollCourseEnrolls();
  }

  pollCourseEnrolls(){
    this.lmsAdminDataCtx.pollCourseMembers(this.courseId)
    .then(resp => {
      if (resp) {
        this.enrollResult = resp;
        this.enrollComplete = true;
        this.pollGroups();
      }
    })
    .catch((e: Event) => {
      console.log('Error retrieving course enrollments ' + e);
      this.pollFail = true;
      this.failMessage = "Error retrieving course enrollments. Please try again.";
    });
  }

  pollGroups(){
    this.lmsAdminDataCtx.pollGroups(this.courseId)
    .then(resp => {
      if (resp) {
        this.groupsResult = resp;
        this.groupsComplete = true;
        this.pollGrpMems();
      }
    })
    .catch((e: Event) => {
      console.log('Error retrieving groups ' + e);
      this.pollFail = true;
      this.failMessage = "Error retrieving groups. Please try again.";
    });
  }

  pollGrpMems(){
    this.lmsAdminDataCtx.pollAllGroupMembers(this.courseId)
    .then(resp => {
      if (resp) {
        //For some reason groups with no additions or removals are getting returned
        var cleanResult: Array<GroupMemReconResult> = [];
        resp.forEach(result => {
          if (result.numAdded > 0 || result.numRemoved > 0){
            cleanResult.push(result);
          }
        });
        this.grpMemResults = cleanResult;
        this.grpMemsComplete = true;
        this.pollComplete = true;
      }
    })
    .catch((e) => {
      console.log('Error retrieving group memberships ' + e);
      this.pollFail = true;
      this.failMessage = "Error retrieving group memberships. Please try again.";
    });
  }

  close(){
    this.dialogRef.close();
  }
}
