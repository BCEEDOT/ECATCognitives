import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { Course, WorkGroup, CrseStudentInGroup, SpInstrument } from "../../core/entities/student";
import { WorkGroupService } from "../services/workgroup.service";
import { GlobalService } from "../../core/services/global.service"
import { StudentDataContext } from "../services/student-data-context.service";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  lastCloseResult: string;
  actionsAlignment: string;
  user: CrseStudentInGroup;
  instructions: string;
  activeWorkGroup: WorkGroup;
  activeWorkGroup$: Observable<WorkGroup>;
  paramWorkGroupId: number;
  paramCourseId: number;
  isLoading: boolean = false;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private studentDataContext: StudentDataContext,
    private route: ActivatedRoute, private dialogService: TdDialogService
    
  ) {

    this.activeWorkGroup$ = route.data.pluck('workGroup');

    this.route.params.subscribe(params => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.paramCourseId = +params['crsId'];

    });

  }

  ngOnInit() {
    this.activeWorkGroup$.subscribe(workGroup => {
      this.activeWorkGroup = workGroup;
      this.activate();
    });
  }

  private activate(force?: boolean): void {

    const userId = this.global.persona.value.person.personId;
    this.user = this.workGroupService.workGroup$.value.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.instructions = this.workGroupService.workGroup$.value.assignedSpInstr.studentInstructions;

  }

}
