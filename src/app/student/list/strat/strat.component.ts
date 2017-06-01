import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/debounceTime'

import { Course, WorkGroup, CrseStudentInGroup, StratResponse } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"
import { SpProviderService } from "../../../provider/sp-provider/sp-provider.service";
import { StudentDataContext } from "../../services/student-data-context.service"

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
    private spTools: SpProviderService, private dialogService: TdDialogService,
    private studentDataContext: StudentDataContext) {
  }

  @Input() workGroup: WorkGroup;

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
    this.evaluateStrat(true);
  }


  cancel() {
    if (this.activeWorkGroup.groupMembers.some(gm => gm.proposedStratPosition !== null)) {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.activeWorkGroup.groupMembers.forEach(gm => {
             gm.stratValidationErrors = [];
             gm.stratIsValid = true;
             gm.proposedStratPosition = null;
           });
          this.snackBarService.open('Changes Discarded', 'Dismiss', {duration: 2000})
          //this.location.back();
        }
      });
    } else {
      //this.location.back();
    }
  }

  isValid(): boolean {
    let invalidStrats = this.activeWorkGroup.groupMembers.some(gm => !gm.stratIsValid);
    let isDirty = this.activeWorkGroup.groupMembers.some(gm => gm.proposedStratPosition !== null);

    if (!isDirty) {
      return true;
    } 

    if (invalidStrats) {
      return true;
    }

    return false;

  }

  isPristine(): boolean {
    return this.activeWorkGroup.groupMembers.some(gm => gm.proposedStratPosition !== null);
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
      //const stratResponse = gm.proposedStratPosition
      const stratResponse = this.studentDataContext.getSingleStrat(gm.studentId, this.workGroupService.workGroup$.value.workGroupId, gm.course.id);
      gm.assesseeStratResponse[0].stratPosition = gm.proposedStratPosition;
      changeSet.push(gm.studentId);
    });

    this.spTools.save().then(() => {

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
