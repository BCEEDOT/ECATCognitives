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

  @Input() workGroup: WorkGroup;

  ngOnInit() {
    this.groupMembers = this.workGroup.groupMembers;

    console.log(this.groupMembers);
  }

}
