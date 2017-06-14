import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup } from "../../../core/entities/faculty";
import { FacWorkgroupService } from "../../services/facworkgroup.service";

@Component({
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements OnInit {


  showComments: boolean = false;
  wgStatus: string = "tc-red-900";
  activeWorkGroup: WorkGroup;
  activeWorkGroup$: Observable<WorkGroup>;
  paramWorkGroupId: number;
  paramCourseId: number;

  constructor(
    private route: ActivatedRoute,
    private facWorkGroupService: FacWorkgroupService,
    private location: Location,

  ) {

    this.activeWorkGroup$ = route.data.pluck('workGroup');

    this.route.params.subscribe(params => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.paramCourseId = +params['crsId'];

    });

  }

  ngOnInit() {
    this.activeWorkGroup$.subscribe(workGroup => {
      this.activeWorkGroup = workGroup;
      this.facWorkGroupService.facWorkGroup(this.activeWorkGroup);
      console.log(this.activeWorkGroup);
    });
  }

}
