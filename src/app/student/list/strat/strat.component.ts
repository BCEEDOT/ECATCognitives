import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/debounceTime'

import { Course, WorkGroup, CrseStudentInGroup, StratResponse } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"
import { SpProviderService } from "../../../provider/sp-provider/sp-provider.service";

@Component({
  selector: 'strat',
  templateUrl: './strat.component.html',
  styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit, OnChanges {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup
  peers: Array<CrseStudentInGroup>;
  errorMessage: string;
  groupCount: number;
  userId: number;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar,
    private spTools: SpProviderService, private dialogService: TdDialogService) {
  }

  @Input() workGroup: WorkGroup;
  @Output() assessCompare = new EventEmitter();

  ngOnInit() {
    this.activate();
  }

  ngOnChanges() {
    this.activate();
  }

  activate() {
    this.activeWorkGroup = this.workGroup;

    this.groupCount = this.activeWorkGroup.groupMembers.length;
    const userId = this.global.persona.value.person.personId;

    this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);
  }

  compare() {
    this.assessCompare.emit();
  }

  isValid(): boolean {
    return this.activeWorkGroup.groupMembers.some(gm => !gm.stratIsValid);
  }

  evaluateStrat(force?: boolean): void {
    this.spTools.evaluateStratification(false, force);
  }

  saveChanges(): void {
    const that = this;
    this.evaluateStrat(true);

    const hasErrors = this.activeWorkGroup.groupMembers
      .some(gm => !gm.stratIsValid);

    if (hasErrors) {
      this.dialogService.openAlert({
        message: 'Your proposed changes contain errors, please ensure all proposed changes are valid before saving'
      })
    }

    const gmWithChanges = this.activeWorkGroup.groupMembers
      .filter(gm => gm.proposedStratPosition !== null);

    const changeSet = [] as Array<number>;

    gmWithChanges.forEach(gm => {
      const stratResponse = gm.proposedStratPosition
      gm.assesseeStratResponse[0].stratPosition = gm.proposedStratPosition;
      changeSet.push(gm.studentId);
    });

    this.spTools.save().then(() =>{

      this.activeWorkGroup.groupMembers
                    .filter(gm => changeSet.some(cs => cs === gm.studentId))
                    .forEach(gm => {
                        gm.stratValidationErrors = [];
                        gm.stratIsValid = true;
                        gm.proposedStratPosition = null;
                    });
      this.user.updateStatusOfPeer();
      this.snackBarService.open("Success, Strats Updated!", 'Dismiss')
    }).catch((error) => {
      this.dialogService.openAlert({
        message: 'There was an error saving your changes, please try again.'
      })
    })

  }

}
