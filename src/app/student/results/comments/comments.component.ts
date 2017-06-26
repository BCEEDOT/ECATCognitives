import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output } from '@angular/core';

import { SpResult, SanitizedSpComment } from "../../../core/entities/student";
import { MpSpStatus } from "../../../core/common/mapStrings";

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  comments: SanitizedSpComment[];
  memHasComments: boolean = false;
  selectedComment: SanitizedSpComment;

  @Input() memberResults: SpResult;

  constructor() { }

  ngOnInit() {
    this.comments = this.memberResults.sanitizedComments;

    if (this.comments || this.comments.length > 0) {
      this.memHasComments = true;

      this.activate();
    }

  }

  activate(): void {
    this.selectedComment = this.comments[0]
  }

  changeComment(comment: SanitizedSpComment) {
    this.selectedComment = comment;
  }

}
