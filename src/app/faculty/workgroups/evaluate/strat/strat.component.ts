import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup, CrseStudentInGroup } from "../../../../core/entities/faculty";
import { SpProviderService } from "../../../../provider/sp-provider/sp-provider.service";

@Component({
  selector: 'strat',
  templateUrl: './strat.component.html',
  styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit {

  groupMembers: CrseStudentInGroup[];

  constructor(private spProvider: SpProviderService,) { }

  @Input() members: CrseStudentInGroup[];

  ngOnInit() {
    this.groupMembers = this.members;

    console.log(this.groupMembers);
  }

}
