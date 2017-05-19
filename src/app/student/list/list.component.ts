import { Component, OnInit, ViewContainerRef, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';

import { Course, WorkGroup, CrseStudentInGroup, SpInstrument } from "../../core/entities/student";
import { WorkGroupService } from "../services/workgroup.service";
import { GlobalService } from "../../core/services/global.service"
import { AssessCompareDialog } from '../shared/assess-compare/assess-compare.dialog';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  dialogRef: MdDialogRef<AssessCompareDialog>;
  lastCloseResult: string;
  actionsAlignment: string;
  user: CrseStudentInGroup;
  instructions: string;
  activeWorkGroup: WorkGroup;
  activeWorkGroup$: Observable<WorkGroup>;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private route: ActivatedRoute, private dialogService: TdDialogService,
    public dialog: MdDialog, @Inject(DOCUMENT) doc: any
  ) {

    this.activeWorkGroup$ = route.data.pluck('workGroup');
  }

  ngOnInit() {
    this.activeWorkGroup$.subscribe(workGroup => {
      this.activeWorkGroup = workGroup;
      this.activate();
    })
  }



  private activate(force?: boolean): void {

    const userId = this.global.persona.value.person.personId;
    this.user = this.workGroupService.workGroup$.value.groupMembers.filter(gm => gm.studentId == userId)[0];
    //console.log(this.workGroupService.workGroup$.value);
    this.instructions = this.workGroupService.workGroup$.value.assignedSpInstr.studentInstructions;
    // this.workGroupService.workGroup$.subscribe(workGroup => {
    //   this.activeWorkGroup = workGroup;
    // })

  }

  assessCompare(): void {

    this.dialogRef = this.dialog.open(AssessCompareDialog, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      width: '',
      height: '',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        workGroup: this.activeWorkGroup
      }
    });

  }

}
