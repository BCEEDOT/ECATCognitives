import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common'
import { Subscriber } from 'rxjs/Subscriber';

import { Router, ActivatedRoute } from '@angular/router';
import { TdLoadingService } from "@covalent/core";
//import * as _ from "lodash";
//import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup, Course } from "../../../core/entities/faculty";
import { FacWorkgroupService } from "../../services/facworkgroup.service";
//import { MpSpStatus } from "../../../core/common/mapStrings";
import { FacultyDataContextService } from "../../services/faculty-data-context.service";

export class RosterInfo {
  rankName: string;
  flights: string[];
}

@Component({
  selector: 'flight-roster',
  templateUrl: './flight-roster.component.html',
  styleUrls: ['./flight-roster.component.scss']
})

export class FlightRosterComponent implements OnInit {

  crsId: number;
  course: Course;
  workGroupId: number;
  workGroup: WorkGroup;
  activeCategory: string;
  categoriesToDisplay: string[] = [];
  groupMembers: CrseStudentInGroup[];
  rosterInfos: RosterInfo[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private loadingService: TdLoadingService,
    private facultyDataContext: FacultyDataContextService,
    private facWorkgroupService: FacWorkgroupService
  ) {
    this.route.params.subscribe(params => {
      this.crsId = +params['crsId'];
      this.workGroupId = +params['wrkGrpId'];

    });
  }

  ngOnInit() {
    this.loadingService.register();
    this.facultyDataContext.fetchAllCourseMembers(this.crsId).then(result => {
      this.course = result as Course;
      this.activate();
    });
  }

  activate(): void {
    this.facWorkgroupService.onListView(false);
    let students = this.course.students;

    this.workGroup = this.course.workGroups.filter(workGroup => workGroup.workGroupId === this.workGroupId)[0];

    this.groupMembers = this.workGroup.groupMembers;

    let workGroups = this.course.workGroups;

    this.activeCategory = this.workGroup.mpCategory;

    var uniqueCategories = [];
    for (let i = 0; i < workGroups.length; i++) {
      if (uniqueCategories.indexOf(workGroups[i].mpCategory) === -1) {
        uniqueCategories.push(workGroups[i].mpCategory);
      }
    }

    //Need to filter out active category and one previous
    this.categoriesToDisplay = uniqueCategories.filter(cat => cat !== this.activeCategory);

    this.groupMembers.sort((stuA: CrseStudentInGroup, stuB: CrseStudentInGroup) => {
      if (stuA.studentProfile.person.lastName < stuB.studentProfile.person.lastName) return -1;
      if (stuA.studentProfile.person.lastName > stuB.studentProfile.person.lastName) return 1;
      if (stuA.studentProfile.person.firstName < stuB.studentProfile.person.firstName) return -1;
      if (stuA.studentProfile.person.firstName > stuB.studentProfile.person.firstName) return 1;
      return 0;
    });

    this.groupMembers.forEach((groupMember: CrseStudentInGroup) => {
      let studentRosterInfo: RosterInfo = { rankName: null, flights: [] };
      studentRosterInfo.rankName = groupMember.rankName;
      let workGroupEnrollments = students.filter(
        student => student.studentPersonId === groupMember.studentId)[0].workGroupEnrollments;
      if (workGroupEnrollments) {
        if (workGroupEnrollments.length > 0) {
          workGroupEnrollments.forEach(workGroupEnrollment => {
            this.categoriesToDisplay.forEach(ctd => {
              if (workGroupEnrollment.workGroup.mpCategory === ctd) {
                studentRosterInfo.flights[ctd] = workGroupEnrollment.workGroup.defaultName;
                //studentRosterInfo[ctd] = workGroupEnrollment.workGroup.defaultName;
              }
            });

          });
        }
      }
      this.rosterInfos.push(studentRosterInfo);
    });

    this.loadingService.resolve()

  }//END ACTIVATE

  back(): void {
    this.location.back();
  }

} //END COMPONENT
