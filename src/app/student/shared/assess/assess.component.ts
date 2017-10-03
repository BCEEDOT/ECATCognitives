import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/takeUntil';

import { Course, WorkGroup, CrseStudentInGroup } from '../../../core/entities/student';
import { WorkGroupService } from '../../services/workgroup.service';
import { GlobalService } from '../../../core/services/global.service';
import { SpProviderService } from '../../../provider/sp-provider/sp-provider.service';
import { MpSpStatus } from '../../../core/common/mapStrings';

@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss'],
})
export class AssessComponent implements OnChanges, OnDestroy {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup;
  peers: CrseStudentInGroup[];
  userId: number;
  readOnly: boolean = false;
  color: string = 'accent';
  checked: boolean = false;
  disabled: boolean = false;
  stratToggle: boolean = false;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar,
    private spProvider: SpProviderService, private router: Router, private route: ActivatedRoute) {
  }

  @Input() workGroup: WorkGroup;
  @Input() change: number;

  ngOnChanges(): void {
    this.activate();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  activate(): void {

    this.activeWorkGroup = this.workGroup;
    this.readOnly = this.activeWorkGroup.mpSpStatus !== MpSpStatus.open;
    const userId: number = this.global.persona.value.person.personId;
    this.user = this.activeWorkGroup.groupMembers.filter((gm: CrseStudentInGroup) => gm.studentId === userId)[0];
    this.user.updateStatusOfPeer();
    this.activeWorkGroup.groupMembers.forEach((gm: CrseStudentInGroup) => {
      const hasComment: boolean = this.user.statusOfPeer[gm.studentId].hasComment;
      const assessComplete: boolean = this.user.statusOfPeer[gm.studentId].assessComplete;
      let commentText: string = '';
      let assessText: string = '';

      if (this.readOnly) {
        commentText = hasComment ? 'comment' : 'not_interested';
        assessText = assessComplete ? 'view_list' : 'None';
      } else {
        commentText = hasComment ? 'mode_edit' : 'add';
        assessText = assessComplete ? 'mode_edit' : 'add';
      }

      gm.commentText = commentText;
      gm.assessText = assessText;

    });

    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);

  }

  comment(recipient: CrseStudentInGroup): any {
    this.spProvider.loadComment(recipient).takeUntil(this.ngUnsubscribe).subscribe(() => { this.activate() });
  }

  assess(assesseeId: number): void {
    this.router.navigate(['assess/' + assesseeId], { relativeTo: this.route });
    this.workGroupService.onListView(false);
  }

}
