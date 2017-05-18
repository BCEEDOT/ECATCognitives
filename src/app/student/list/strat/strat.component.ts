import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';

import { Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"

@Component({
  selector: 'strat',
  templateUrl: './strat.component.html',
  styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup
  peers: Array<CrseStudentInGroup>;
  userId: number;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar) {
  }

  @Input() workGroup: WorkGroup;
  @Output() assessCompare = new EventEmitter();

  ngOnInit() {
    this.activate();
  }

  activate() {
    this.activeWorkGroup = this.workGroup;
    const userId = this.global.persona.value.person.personId;

    this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);
    console.log(this.user);
    console.log(this.peers);
  }

  compare() {
    this.assessCompare.emit();
  }

}
