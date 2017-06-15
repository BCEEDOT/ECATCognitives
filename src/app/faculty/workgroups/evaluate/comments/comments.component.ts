import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup, CrseStudentInGroup } from "../../../../core/entities/faculty";

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  constructor() { }

  @Input() members: CrseStudentInGroup[];

  ngOnInit() {
  }

}
