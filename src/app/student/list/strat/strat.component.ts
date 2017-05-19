import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/debounceTime'

import { Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"
import { SpProviderService } from "../../../provider/sp-provider/sp-provider.service";

@Component({
  selector: 'strat',
  templateUrl: './strat.component.html',
  styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup
  peers: Array<CrseStudentInGroup>;
  errorMessage: string;
  groupCount: number;
  userId: number;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar, private spTools: SpProviderService) {
  }

  @Input() workGroup: WorkGroup;
  @Output() assessCompare = new EventEmitter();

  ngOnInit() {
    this.activate();
  }

  activate() {
    this.activeWorkGroup = this.workGroup;

    this.groupCount = this.activeWorkGroup.groupMembers.length;
    const userId = this.global.persona.value.person.personId;

    this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);
    console.log(this.user);
    console.log(this.peers);
  }

  compare() {
    this.assessCompare.emit();
  }

  evaluateStrat(force?: boolean): void {
    this.spTools.evaluateStratification(false, force).then((members) => {
      console.log("Strats Evaluated");
    });




//     <div>
//     <dl ng-repeat="err in peer.stratValidationErrors" ng-if="peer">
//         <dt>{{err.cat}}</dt>
//         <dd>{{err.text}}</dd>
//     </dl>

//     <dl ng-repeat="err in member.stratValidationErrors" ng-if="member">
//         <dt>{{err.cat}}</dt>
//         <dd>{{err.text}}</dd>
//     </dl>

//     <dl ng-repeat="err in al.me.stratValidationErrors" ng-if="!peer && !member">
//         <dt>{{err.cat}}</dt>
//         <dd>{{err.text}}</dd>
//     </dl>
// </div>
    
  }

  saveChanges(): void {
    this.evaluateStrat(true);

    const hasErrors = this.activeWorkGroup.groupMembers
            .some(gm => !gm.stratIsValid);

    if (hasErrors) {
      console.log("There was an error");
    }

  }

}
