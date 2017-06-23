import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup, CrseStudentInGroup } from "../../../../core/entities/faculty";

@Component({
  selector: 'assess-overview',
  templateUrl: './assess-overview.component.html',
  styleUrls: ['./assess-overview.component.scss']
})
export class AssessOverviewComponent implements OnInit {

  @Input() membersResults: CrseStudentInGroup[];

  chartColors = {domain: ['#00308F', '#00AA58', '#AAAAAA', '#AA0000']};

  constructor() { }

  ngOnInit() {
  }

}
