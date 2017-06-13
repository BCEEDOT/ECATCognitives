import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';

import { Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"
import { SpProviderService } from "../../../provider/sp-provider/sp-provider.service";


@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit, OnChanges {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup;
  peers: CrseStudentInGroup[];
  userId: number;
  isLoading: boolean = false;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar, private spProdiver: SpProviderService) {

      //this.workGroupService.isLoading$.subscribe(value => this.isLoading = value);
  }

  @Input() workGroup: WorkGroup;

  ngOnInit(): void {
    this.activate();
  }

  ngOnChanges(): void {
    this.activate();
  }

  activate() {

    this.activeWorkGroup = this.workGroup;
    const userId = this.global.persona.value.person.personId;
    this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.user.updateStatusOfPeer();
    this.activeWorkGroup.groupMembers.forEach(gm => {
      gm['assessText'] = (this.user.statusOfPeer[gm.studentId].assessComplete) ? 'mode_edit' : 'add';
      gm['commentText'] = (this.user.statusOfPeer[gm.studentId].hasComment) ? 'mode_edit' : 'add';
      // gm['stratText'] = (this.user.statusOfPeer[gm.studentId].stratComplete) ? this.user.statusOfPeer[gm.studentId].stratedPosition : 'None';
    });

    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);

    //this.workGroupService.isLoading(false);


  }

  comment(recipient: CrseStudentInGroup): any {
    this.spProdiver.loadComment(recipient);
  }

}
