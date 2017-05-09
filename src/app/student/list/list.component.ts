import { Component, OnInit } from '@angular/core';

import { Course, WorkGroup, CrseStudentInGroup } from "../../core/entities/student";
import { WorkGroupService } from "../services/workgroup.service";
import { GlobalService } from "../../core/services/global.service"


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  hasAcknowldged: boolean = false;
  user: CrseStudentInGroup;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService) { }

  ngOnInit() {
    this.activate();
  }

  private activate(force?: boolean): void {

    const userId = this.global.persona.value.person.personId;
    this.hasAcknowldged = this.workGroupService.workGroup$.value.groupMembers.filter(gm => gm.studentId == userId)[0].hasAcknowledged;
    
  }

}
