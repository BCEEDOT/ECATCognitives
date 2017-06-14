import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup } from "../../../../core/entities/faculty";

@Component({
  selector: 'strat',
  templateUrl: './strat.component.html',
  styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit {

  constructor() { }

  @Input() workGroup: WorkGroup;

  ngOnInit() {
  }

}
