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
  personId: number;
  rankName: string;
  scatter1: string;
  scatter2: string;
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
  groupMembers: CrseStudentInGroup[];
  rosterInfos: RosterInfo[] = [];


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private loadingService: TdLoadingService,
    private facultyDataContext: FacultyDataContextService,
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
console.log('crsId:  ' + this.crsId);
console.log('workGroupId:  ' + this.workGroupId);
console.log(this.course);

    let students = this.course.students;
console.log(students);

    this.workGroup = this.course.workGroups.filter(workGroup => workGroup.workGroupId === this.workGroupId)[0];
console.log(this.workGroup);

    this.groupMembers = this.workGroup.groupMembers;
console.log(this.groupMembers);

/*     this.groupMembers.forEach((groupMember: CrseStudentInGroup) => {
      let studentRosterInfo: RosterInfo;
      studentRosterInfo.personId = groupMember.studentId;
      studentRosterInfo.rankName = groupMember.rankName;
      let workGroupEnrollments = students.filter(
        student => student.studentPersonId === groupMember.studentId)[0].workGroupEnrollments;
      if (workGroupEnrollments) {
        if (workGroupEnrollments.length > 0) {
          workGroupEnrollments.forEach(workGroupEnrollment => {
            if (workGroupEnrollment.workGroup.mpCategory ===  )
              });
        }
      }
    }); */

    this.loadingService.resolve()

  }//END ACTIVATE

} //END COMPONENT
