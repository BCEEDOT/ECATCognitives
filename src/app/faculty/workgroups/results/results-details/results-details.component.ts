import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { CrseStudentInGroup } from "../../../../core/entities/faculty";
import { FacultyDataContextService } from "../../../services/faculty-data-context.service";
import { FacWorkgroupService } from "../../../services/facworkgroup.service";

@Component({
  selector: 'results-details',
  templateUrl: './results-details.component.html',
  styleUrls: ['./results-details.component.scss']
})
export class ResultsDetailsComponent implements OnInit {
  selStudent: CrseStudentInGroup;
  groupMems: CrseStudentInGroup[];
  isLoading: boolean;

  constructor(private facWorkGroupService: FacWorkgroupService,
    private facultyDataContext: FacultyDataContextService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.facWorkGroupService.onListView(false);
    this.isLoading = true;

    let workGroupId: number;
    let courseId: number;
    let studId: number;
    this.route.params.subscribe(params => {
      workGroupId = +params['wrkGrpId'];
      courseId = +params['crsId'];
      studId = +params['stuId'];
    });

    this.facultyDataContext.fetchGrpMemsWithSpResults(courseId, workGroupId)
      .then((results: CrseStudentInGroup[]) => {
        this.groupMems = results.sort((a: CrseStudentInGroup, b: CrseStudentInGroup) => {
          if (a.studentProfile.person.lastName > b.studentProfile.person.lastName) { return 1; }
          if (a.studentProfile.person.lastName < b.studentProfile.person.lastName) { return -1; }
          return 0;
        });;
        this.selStudent = this.groupMems.filter(mem => mem.studentId === studId)[0];
        this.isLoading = false;
      });
  }

}
