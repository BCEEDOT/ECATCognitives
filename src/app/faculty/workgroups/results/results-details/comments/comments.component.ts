import { Component, OnInit, Input } from '@angular/core';
import { CrseStudentInGroup } from "../../../../../core/entities/faculty";

@Component({
  selector: 'results-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class ResultsCommentsComponent implements OnInit {
  @Input() student: CrseStudentInGroup;

  constructor() { }

  ngOnInit() {
  }

}
