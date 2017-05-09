import { Component, OnInit } from '@angular/core';
import { Course, WorkGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";


@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

  activeWorkGroup: WorkGroup;

  constructor(private workGroupService: WorkGroupService) { }

  ngOnInit() {
    this.activeWorkGroup = this.workGroupService.workGroup$.value;
    console.log(this.activeWorkGroup);
  }

}
