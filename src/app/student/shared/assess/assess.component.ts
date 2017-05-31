import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';

import { Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"


@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup
  peers: Array<CrseStudentInGroup>;
  userId: number;
  assessIsLoaded = 'assessIsLoaded';

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar) {
  }

  @Input() workGroup: WorkGroup;

  ngOnInit() {

    this.activate();

  }

  //  ngOnChanges() {

  //    console.log("workgroup changed")
  //    this.activate();
  // }

  // ngAfterViewInit() {
  //    setTimeout(() => this.loadingService.register = () => this.loadingService.register());
  // }

  // ngAfterViewChecked() {
  //   setTimeout(() => this.loadingService.register = () => this.loadingService.register());
  // }



  activate() {
    // this.workGroupService.workGroup$.subscribe(workGroup => {
    //   this.activeWorkGroup = workGroup;
    // });
    this.activeWorkGroup = this.workGroup;
    const userId = this.global.persona.value.person.personId;

    this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];
    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);

    console.log(this.user);
    console.log(this.peers);
  }

}
