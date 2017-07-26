import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from "@angular/router";
import { TdDialogService } from "@covalent/core";
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup } from "../../../core/entities/faculty";
import { FacultyDataContextService } from "../../services/faculty-data-context.service";
import { GlobalService } from "../../../core/services/global.service";
import { MpSpStatus } from "../../../core/common/mapStrings";
import { FacWorkgroupService } from "../../services/facworkgroup.service";
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
  workGroup: WorkGroup;
  workGroup$: Observable<WorkGroup>;
  canReview: boolean = false;
  members: Array<CrseStudExtended>;
  wgName: string;
  //private facIncomplete: boolean = false;
  chartColors = {domain: ['#00308F', '#00AA58', '#AAAAAA', '#AA0000']};
  statusMap = MpSpStatus;

  constructor(private ctx: FacultyDataContextService,
    private global: GlobalService,
    private dialogService: TdDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private facWorkGroupService: FacWorkgroupService) {
      this.workGroup$ = route.data.pluck('workGroup');
    }

  ngOnInit() {
    this.workGroup$.subscribe(wg => {
      this.workGroup = wg;
      this.activate();
    });

    this.facWorkGroupService.onListView(false);
  }

  activate() {
    this.wgName = (this.workGroup.customName) ? `${this.workGroup.customName} [${this.workGroup.defaultName}]` : this.workGroup.defaultName;
    this.members = this.workGroup.groupMembers as Array<CrseStudExtended>;
    this.members.sort((a: CrseStudExtended, b: CrseStudExtended) => {
      if (a.studentProfile.person.lastName > b.studentProfile.person.lastName) {return 1;}
      if (a.studentProfile.person.lastName < b.studentProfile.person.lastName) {return -1;}
      return 0;
    })

    this.members.forEach(gm => {
      const isSelfDone = gm.statusOfPeer[gm.studentId].assessComplete;
      const peers = this.workGroup.groupMembers.filter(mem => mem.studentId !== gm.studentId);
      const peersSpCompletion = peers.map(mem => gm.statusOfPeer[mem.studentId].assessComplete);

      gm['hasChartData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.value > 0);

      // if (gm['hasChartData']) {
      //   gm.updateStatusOfStudent();
      // }

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

    this.canReview = this.workGroup.canPublish;
    if (this.workGroup.mpSpStatus === MpSpStatus.underReview || this.workGroup.mpSpStatus === MpSpStatus.reviewed) {this.canReview = true;}
  }

  refreshData() {
    this.ctx.fetchActiveWorkGroup(this.workGroup.courseId, this.workGroup.workGroupId, true)
      .then(data => {
        this.workGroup = data;
        this.activate();
      });
  }

  reviewFlight() {
    switch(this.workGroup.mpSpStatus){
      case MpSpStatus.created:
      case MpSpStatus.published:
        this.dialogService.openAlert({
          message: 'Group is not in the proper state for review.',
          title: 'Cannot Review Flight'
        });
        return;
      case MpSpStatus.underReview:
      case MpSpStatus.reviewed:
        this.router.navigate(['list', this.workGroup.courseId, 'evaluate', this.workGroup.workGroupId], {relativeTo: this.route.parent});
        break;
    }

    if(!this.canReview){
      this.dialogService.openAlert({
        message: 'All students must complete all assessments and strats.',
        title: 'Cannot Review Flight'
      });
      return;

    } else {
      if (this.workGroup.mpSpStatus === MpSpStatus.open){
        this.dialogService.openConfirm({
          message: 'Students will no longer be able to make changes to assessments/comments/strats. \n\n Are you sure you want to place this flight Under Review?',
          title: 'Review Flight',
          acceptButton: 'Yes',
          cancelButton: 'No'
        }).afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.workGroup.mpSpStatus = MpSpStatus.underReview;
            this.ctx.commit().then(_ => {
                this.router.navigate(['list', this.workGroup.courseId, 'evaluate', this.workGroup.workGroupId], {relativeTo: this.route.parent});
              }
            )
          }
        });
      }
    }
  }

}
