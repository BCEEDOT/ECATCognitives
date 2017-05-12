import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"


@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit, OnChanges {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup
  peers: Array<CrseStudentInGroup>;
  userId: number;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService) { }

  @Input() workGroup: WorkGroup;

  ngOnInit() {
    
    this.activate();

  }

  ngOnChanges() {
    this.activate();
  }

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
