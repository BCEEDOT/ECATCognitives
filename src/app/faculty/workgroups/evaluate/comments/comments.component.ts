import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { MdSnackBar } from '@angular/material';
import { TdDialogService } from "@covalent/core";

import { WorkGroup, CrseStudentInGroup, StudSpComment } from "../../../../core/entities/faculty";
import { ActivatedRoute } from "@angular/router";
import { FacultyDataContextService } from "../../../services/faculty-data-context.service";
import { MpCommentFlag } from "../../../../core/common/mapStrings";
import { FacWorkgroupService } from "../../../services/facworkgroup.service";

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  private memsWithComments: CrseStudentInGroup[];
  private selectedAuthor: CrseStudentInGroup;
  private authoredComments: StudSpComment[];
  private selectedComment: StudSpComment;
  private grpHasComments: boolean = true;
  private commFlagMap = MpCommentFlag;
  private hasChanges: boolean = false;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private ctx: FacultyDataContextService,
    private snackBar: MdSnackBar,
    private dialogService: TdDialogService,
    private facWorkGroupService: FacWorkgroupService,) { }

  @Input() members: CrseStudentInGroup[];

  ngOnInit() {
    this.ctx.fetchActiveWgSpComments(this.members[0].courseId, this.members[0].workGroupId).then(_ => this.activate());
  }

  activate() {
    this.memsWithComments = [];
    this.members.forEach(mem => {
      if (mem.authorOfComments.length > 0){
        mem['numRemaining'] = mem.authorOfComments.filter(com => com.flag.mpFaculty === null).length;
        mem['apprFlags'] = mem.authorOfComments.filter(com => com.flag.mpFaculty === MpCommentFlag.appr).length;
        mem['inapprFlags'] = mem.authorOfComments.filter(com => com.flag.mpFaculty === MpCommentFlag.inappr).length;
        this.memsWithComments.push(mem);
      }
    });

    if(this.memsWithComments.length === 0) {
      this.grpHasComments = false;
      this.facWorkGroupService.commentsComplete(true);
      return;
    }

    this.selectedAuthor = this.memsWithComments[0];

    if (this.memsWithComments.some(mem => mem['numRemaining'] > 0)){
        this.facWorkGroupService.commentsComplete(false);
    } else {
      this.hasChanges = this.selectedAuthor.workGroup.spComments.some(com => com.flag.entityAspect.entityState.isAddedModifiedOrDeleted());
      if (this.hasChanges){
        this.facWorkGroupService.commentsComplete(false);
      } else {
        this.facWorkGroupService.commentsComplete(true);
      }
    }

    this.changeAuthor(this.selectedAuthor);
  }

  changeAuthor(sel: CrseStudentInGroup){
    this.selectedAuthor = sel;
    this.authoredComments = this.selectedAuthor.authorOfComments;

    this.authoredComments.sort((a: StudSpComment, b: StudSpComment) => {
      if (a.recipient.studentProfile.person.lastName > b.recipient.studentProfile.person.lastName) {return 1;}
      if (a.recipient.studentProfile.person.lastName < b.recipient.studentProfile.person.lastName) {return -1;}
      return 0;
    });

    this.checkComplete();
    this.selectedComment = this.authoredComments[0];
  }

  checkComplete(){
    this.selectedAuthor.authorOfComments.forEach(com => {
      switch(com.flag.mpFaculty){
        case MpCommentFlag.appr: com['icon'] = 'done'; break;
        case MpCommentFlag.inappr: com['icon'] = 'highlight_off'; break;
        default: com['icon'] = '';
      }

      com['displayDate'] = com.modifiedDate.toDateString() + ' ' + com.modifiedDate.getHours().toString() + ':' + com.modifiedDate.getMinutes().toString();
    });

    this.selectedAuthor['numRemaining'] = this.selectedAuthor.authorOfComments.filter(com => com.flag.mpFaculty === null).length;
    this.selectedAuthor['apprFlags'] = this.selectedAuthor.authorOfComments.filter(com => com.flag.mpFaculty === MpCommentFlag.appr).length;
    this.selectedAuthor['inapprFlags'] = this.selectedAuthor.authorOfComments.filter(com => com.flag.mpFaculty === MpCommentFlag.inappr).length;

    this.hasChanges = this.selectedAuthor.workGroup.spComments.some(com => com.flag.entityAspect.entityState.isAddedModifiedOrDeleted());
  }

  massSetAll(){
    let allUnflagged = this.members[0].workGroup.spComments.filter(com => com.flag.mpFaculty === null);
    allUnflagged.forEach(com => com.flag.mpFaculty = MpCommentFlag.appr);
    this.activate();
  }

  massResetAll(){
    let allComments = this.members[0].workGroup.spComments;
    allComments.forEach(com => com.flag.mpFaculty = MpCommentFlag.appr);
    this.activate();
  }

  massSetAuthor(){
    let authUnflagged = this.authoredComments.filter(com => com.flag.mpFaculty === null);
    authUnflagged.forEach(com => com.flag.mpFaculty = MpCommentFlag.appr);
    this.checkComplete();
  }

  massResetAuthor(){
    this.authoredComments.forEach(com => com.flag.mpFaculty = MpCommentFlag.appr);
    this.checkComplete();
  }

  save() {
    this.ctx.commit().then(fulfilled => {
      this.snackBar.open('Comment Flags Saved!', 'Dismiss', { duration: 2000});
      if (!this.memsWithComments.some(mem => mem['numRemaining'] > 0)){
        this.facWorkGroupService.commentsComplete(true);
      }
    }, (reject => {
      this.dialogService.openAlert({message: 'There was a problem saving your flags, please try again.', title: 'Save Error'});
    }));
  }

  discard() {
    let changes = this.selectedAuthor.workGroup.spComments.filter(com => com.flag.entityAspect.entityState.isAddedModifiedOrDeleted());

    if (changes.length > 0){
      this.dialogService.openConfirm({
          message: 'You have ' + changes.length + ' unsaved comment flag changes. Are you sure you want to discard them?',
          title: 'Discard Changes',
          acceptButton: 'Yes',
          cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          changes.forEach(com => com.flag.entityAspect.rejectChanges());
          this.activate();
        }
      });
    } else {
      this.dialogService.openAlert({message: 'No changes to discard.', title: 'Discard Changes'});
    }
  }
}
