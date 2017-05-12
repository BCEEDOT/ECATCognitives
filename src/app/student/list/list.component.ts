import { Component, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { Course, WorkGroup, CrseStudentInGroup, SpInstrument } from "../../core/entities/student";
import { WorkGroupService } from "../services/workgroup.service";
import { GlobalService } from "../../core/services/global.service"


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {

  hasAcknowledged: boolean = false;
  user: CrseStudentInGroup;
  instructions: string;
  activeWorkGroup: WorkGroup;
  activeWorkGroup$: Observable<WorkGroup>;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService, private route: ActivatedRoute) { 
    this.activeWorkGroup$ = route.data.pluck('workGroup');
  }

  ngOnInit() {
    this.activeWorkGroup$.subscribe(workGroup => {
      this.activeWorkGroup = workGroup;
      this.activate();
    })
  }
  
  ngOnChanges() {
    this.activate();
  }

  private activate(force?: boolean): void {

    const userId = this.global.persona.value.person.personId;
    this.hasAcknowledged = this.workGroupService.workGroup$.value.groupMembers.filter(gm => gm.studentId == userId)[0].hasAcknowledged;
    //console.log(this.workGroupService.workGroup$.value);
    this.instructions = this.workGroupService.workGroup$.value.assignedSpInstr.studentInstructions;
    // this.workGroupService.workGroup$.subscribe(workGroup => {
    //   this.activeWorkGroup = workGroup;
    // })

  }

  agree() {
    this.hasAcknowledged = true;
  }

}
