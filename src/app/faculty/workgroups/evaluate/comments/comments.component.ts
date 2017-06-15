import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

import { WorkGroup, CrseStudentInGroup, StudSpComment } from "../../../../core/entities/faculty";
import { ActivatedRoute } from "@angular/router";
import { FacultyDataContextService } from "../../../services/faculty-data-context.service";

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  private memsWithComments: CrseStudentInGroup[] = [];
  private selectedAuthor: CrseStudentInGroup;
  private authoredComments: StudSpComment[];
  private selectedComment: StudSpComment;
  private grpHasComments: boolean = true;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private ctx: FacultyDataContextService) { }

  @Input() members: CrseStudentInGroup[];

  ngOnInit() {
    this.ctx.fetchActiveWgSpComments(this.members[0].courseId, this.members[0].workGroupId).then(_ => this.activate());
  }

  activate() {
    this.members.forEach(mem => {
      if (mem.authorOfComments.length > 0){
        mem['reviewIncomplete'] = mem.authorOfComments.some(com => com.flag.mpFaculty === null);
        mem['icon'] = (mem['reviewIncomplete']) ? "indeterminate_check_box": "check_box";
        this.memsWithComments.push(mem);
      }
    });
    this.selectedAuthor = this.memsWithComments[0];
    if (this.selectedAuthor.workGroup.spComments.length === 0){
      this.grpHasComments = false;
      return;
    }
    
    this.changeAuthor(this.selectedAuthor);
  }

  changeAuthor(sel: CrseStudentInGroup){
    this.selectedAuthor = sel;
    this.authoredComments = this.selectedAuthor.authorOfComments;
    this.setUpComments();
    this.selectedComment = this.authoredComments[0];
  }

  checkComplete(auth: CrseStudentInGroup){
    auth.authorOfComments.forEach(com => {
      if (com.flag.mpFaculty !== null){
        auth['reviewIncomplete'] = false;
      }
    });
  }

  setUpComments() {
    this.authoredComments.sort((a: StudSpComment, b: StudSpComment) => {
      if (a.recipient.studentProfile.person.lastName > b.recipient.studentProfile.person.lastName) {return 1;}
      if (a.recipient.studentProfile.person.lastName < b.recipient.studentProfile.person.lastName) {return -1;}
      return 0;
    });

    this.authoredComments.forEach(com => {
      com['icon'] = (com.flag.mpFaculty === null) ? "indeterminate_check_box": "check_box";
    });
  }
}
