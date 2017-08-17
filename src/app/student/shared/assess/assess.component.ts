import { Subject } from "rxjs/Subject";
import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/takeUntil';

import { Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"
import { SpProviderService } from "../../../provider/sp-provider/sp-provider.service";
import { MpSpStatus } from "../../../core/common/mapStrings";


@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit, OnChanges, OnDestroy {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup;
  peers: CrseStudentInGroup[];
  userId: number;
  readOnly: boolean = false;
  color = 'accent';
  checked = false;
  disabled = false;
  stratToggle: boolean = false;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar, private spProvider: SpProviderService) {
  }

  @Input() workGroup: WorkGroup;

  ngOnInit(): void {
    this.activate();
  }

  ngOnChanges(): void {
    this.activate();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  activate() {

    this.activeWorkGroup = this.workGroup;
    this.readOnly = this.activeWorkGroup.mpSpStatus !== MpSpStatus.open;
    const userId = this.global.persona.value.person.personId;
    this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.user.updateStatusOfPeer();
    this.activeWorkGroup.groupMembers.forEach(gm => {
      const hasComment = this.user.statusOfPeer[gm.studentId].hasComment;
      const assessComplete = this.user.statusOfPeer[gm.studentId].assessComplete;
      let commentText = '';
      let assessText = '';

      if (this.readOnly) {
        commentText = hasComment ? 'comment' : 'not_interested';
        assessText = assessComplete ? 'view_list' : 'None';
      } else {
        commentText = hasComment ? 'mode_edit' : 'add';
        assessText = assessComplete ? 'mode_edit' : 'add';
      }

      // gm['stratText'] = (this.user.statusOfPeer[gm.studentId].stratComplete) ? this.user.statusOfPeer[gm.studentId].stratedPosition : 'None';

      gm.commentText = commentText;
      gm.assessText = assessText;

    });

    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);

  }

  comment(recipient: CrseStudentInGroup): any {
    this.spProvider.loadComment(recipient).takeUntil(this.ngUnsubscribe).subscribe(() => { this.activate() });
  }

}
