import { Component, OnInit, Input } from '@angular/core';
import { TdDialogService } from "@covalent/core";

import { CrseStudentInGroup, StudSpComment } from "../../../../../core/entities/faculty";
import { MpCommentFlag } from "../../../../../core/common/mapStrings";

@Component({
  selector: 'results-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class ResultsCommentsComponent implements OnInit {
  @Input() student: CrseStudentInGroup;
  commFlagMap = MpCommentFlag;

  constructor(private tdDialogService: TdDialogService) { }

  ngOnInit() {
    
  }

  ngOnChanges(){
    this.student.recipientOfComments.sort((a: StudSpComment, b: StudSpComment) => {
      if (a.author.studentProfile.person.lastName > b.author.studentProfile.person.lastName) { return 1; }
      if (a.author.studentProfile.person.lastName < b.author.studentProfile.person.lastName) { return -1; }
      return 0;
    });

    this.student.authorOfComments.sort((a: StudSpComment, b: StudSpComment) => {
      if (a.recipient.studentProfile.person.lastName > b.recipient.studentProfile.person.lastName) { return 1; }
      if (a.recipient.studentProfile.person.lastName < b.recipient.studentProfile.person.lastName) { return -1; }
      return 0;
    });
  }

  viewFullComment(comment: StudSpComment){
    let title: string;
    if (comment.authorPersonId === this.student.studentId){ 
      title = 'To: ' + comment.recipient.rankName; 
    } else {
      title = 'From: ' + comment.author.rankName;
    }

    this.tdDialogService.openAlert({
      message: comment.commentText,
      title: title,
      closeButton: 'Close'
    });
  }

}
