import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup, CrseStudentInGroup } from "../../../../core/entities/faculty";

@Component({
  selector: 'strat-overview',
  templateUrl: './strat-overview.component.html',
  styleUrls: ['./strat-overview.component.scss']
})
export class StratOverviewComponent implements OnInit {

  @Input() membersResults: CrseStudentInGroup[];

  constructor() { }

  ngOnInit() {
  }

}
