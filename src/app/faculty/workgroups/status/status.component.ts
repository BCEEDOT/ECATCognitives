import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from "@angular/router";
import { TdDialogService } from "@covalent/core";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup } from "../../../core/entities/faculty";
import { FacultyDataContextService } from "../../services/faculty-data-context.service";
import { GlobalService } from "../../../core/services/global.service";
import { MpSpStatus } from "../../../core/common/mapStrings";

interface CrseStudExtended extends CrseStudentInGroup {
    check: {
        isSelfDone: boolean,
        sp: {
            isDone: boolean;
            count: string;
        },
        strat: {
            isDone: boolean;
            count: string;
        }
    }
}

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})

export class StatusComponent implements OnInit {
  private workGroup: WorkGroup;
  private workGroup$: Observable<WorkGroup>;
  private canReview: boolean = false;
  private members: Array<CrseStudExtended>;
  private wgName: string;
  private facIncomplete: boolean = false;

  constructor(private ctx: FacultyDataContextService,
    private global: GlobalService,
    private dialogService: TdDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {
      this.workGroup$ = route.data.pluck('workGroup');
    }

  ngOnInit() {
    this.workGroup$.subscribe(wg => {this.workGroup = wg;});
    this.wgName = (this.workGroup.customName) ? `${this.workGroup.customName} [${this.workGroup.defaultName}]` : this.workGroup.defaultName;
    this.members = this.workGroup.groupMembers as Array<CrseStudExtended>;

    this.members.forEach(gm => {
      const isSelfDone = gm.statusOfPeer[gm.studentId].assessComplete;
      const peers = this.workGroup.groupMembers.filter(mem => mem.studentId !== gm.studentId);
      const peersSpCompletion = peers.map(mem => gm.statusOfPeer[mem.studentId].assessComplete);

      gm['hasChartData'] = gm.statusOfStudent.gaveBreakOutChartData.some(cd => cd.data > 0);

      gm.check = {
        isSelfDone: isSelfDone,
        sp: {
          isDone: !peersSpCompletion.some(complete => !complete),
          count: `${peersSpCompletion.filter(complete => complete).length} / ${peersSpCompletion.length}`
        },
        strat: {
          isDone: gm.numOfStratIncomplete === 0,
          count: `${this.workGroup.groupMembers.length - gm.numOfStratIncomplete} / ${this.workGroup.groupMembers.length}`
        }
      }
    });

    this.facIncomplete = this.members.some(mem => {
      if (mem.statusOfStudent.spResponses.length == 0) {return true;}
      if (!mem.statusOfStudent.stratComplete) {return true;}
      return false;
    });

    if (this.workGroup.canPublish && !this.facIncomplete){
      this.canReview = true;
    }
  }

  refreshData() {
    this.ctx.fetchActiveWorkGroup(this.workGroup.courseId, this.workGroup.workGroupId, true)
      .then(data => {
        this.workGroup = data;
      });
  }

  reviewFlight() {
    if(!this.canReview){
      let message: string;

      if (this.workGroup.mpSpStatus === MpSpStatus.underReview) {
        //this.router.navigate(['/publish']);
      } else if (this.workGroup.mpSpStatus === MpSpStatus.published) {
        this.dialogService.openAlert({
          message: 'This group is already published.',
          title: 'Cannot Begin Review'
        });
        return;
      }

      let studIncomplete: boolean = true;
      studIncomplete = this.members.some(mem => {
        if (!mem.check.isSelfDone) {return true;}
        if (!mem.check.sp.isDone) {return true;}
        if (!mem.check.strat.isDone) {return true;}
        return false;
      });

      message= 'There are incomplete items. /n';
      if (studIncomplete) { 
        message = message + '/n All students must complete all assessments and strats.'
      } 

      if (this.facIncomplete){
        message = message + '/n You must assess and strat all students.'
      }

      this.dialogService.openAlert({
        message: message,
        title: 'Cannot Begin Review'
      });
      return;
    } else {
      //this.router.navigate(['/publish']);
    }
  }

}
