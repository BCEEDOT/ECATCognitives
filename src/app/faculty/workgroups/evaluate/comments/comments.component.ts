import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup } from "../../../../core/entities/faculty";

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  constructor() { }

  @Input() workGroup: WorkGroup;

  ngOnInit() {
  }

}
