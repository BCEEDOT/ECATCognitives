import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/pluck';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { Course, WorkGroup, CrseStudentInGroup, SpInstrument } from "../../core/entities/student";
import { WorkGroupService } from "../services/workgroup.service";
import { GlobalService } from "../../core/services/global.service"
import { StudentDataContext } from "../services/student-data-context.service";
import { MpSpStatus } from "../../core/common/mapStrings";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  //lastCloseResult: string;
  assessComplete: boolean = false;
  stratComplete: boolean = false;
  assessStatusIcon: string;
  stratStatusIcon: string;
  actionsAlignment: string;
  user: CrseStudentInGroup;
  instructions: string;
  activeWorkGroup: WorkGroup;
  activeWorkGroup$: Observable<WorkGroup>;
  paramWorkGroupId: number;
  paramCourseId: number;
  isLoading: boolean = false;
  readOnly: boolean = false;
  subs: Subscription[] = [];
  

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private studentDataContext: StudentDataContext,
    private route: ActivatedRoute, private dialogService: TdDialogService

  ) {

    this.activeWorkGroup$ = route.data.pluck('workGroup');

    this.route.params.subscribe(params => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.paramCourseId = +params['crsId'];

    });

    this.subs.push(this.workGroupService.isLoading$.subscribe(value => {
      this.isLoading = value;
    }));

    this.subs.push(this.workGroupService.assessComplete$.subscribe(ac => {
      this.assessComplete = ac;
      this.assessStatusIcon = (this.assessComplete) ? "check_circle" : "error_outline";
    }));

    this.subs.push(this.workGroupService.stratComplete$.subscribe(sc => {
      this.stratComplete = sc;
      this.stratStatusIcon = (this.stratComplete) ? "check_circle" : "error_outline";
    }));

  }

  ngOnInit() {
    this.activeWorkGroup$.subscribe(workGroup => {
      this.activeWorkGroup = workGroup;
      this.activate();
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  activate(force?: boolean): void {

    const userId = this.global.persona.value.person.personId;
    this.user = this.workGroupService.workGroup$.value.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.user.updateStatusOfPeer();
    this.instructions = this.workGroupService.workGroup$.value.assignedSpInstr.studentInstructions;
    this.readOnly = this.workGroupService.workGroup$.value.mpSpStatus !== MpSpStatus.open
    this.workGroupService.isLoading(false);

    let memberIds = Object.keys(this.user.statusOfPeer);

    let assessIncomplete = this.activeWorkGroup.groupMembers.some(mem => {
      let hasAssess: boolean = false;
      memberIds.forEach(id => {
        if (!this.user.statusOfPeer[+id].assessComplete) { hasAssess = true; }
      });

      return hasAssess;

    });

    this.workGroupService.assessComplete(!assessIncomplete);

    let stratIncomplete = this.activeWorkGroup.groupMembers.some(mem => {
      let hasStrat: boolean = false;

      memberIds.forEach(id => {
        if (!this.user.statusOfPeer[+id].stratComplete) { hasStrat = true; }
      });

      return hasStrat;
    });

    this.workGroupService.stratComplete(!stratIncomplete);

  }

}
