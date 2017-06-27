import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { IPageChangeEvent } from "@covalent/core";

import { Course, StudentInCourse, FacultyInCourse } from "../../../core/entities/faculty";
import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";

@Component({
  selector: 'app-course-enroll',
  templateUrl: './course-enroll.component.html',
  styleUrls: ['./course-enroll.component.scss']
})
export class CourseEnrollComponent implements OnInit {
  course: Course;
  studentsPage: Array<StudentInCourse>;

  constructor(private lmsadminDataContextService: LmsadminDataContextService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let courseId: number = +params['crsId'];
      this.lmsadminDataContextService.fetchAllCourseMembers(courseId).then((course: Course) => {
        this.course = course;
        this.activate();
      });
    })
  }

  activate(){
    this.course.students.sort((a: StudentInCourse, b: StudentInCourse) => {
      if (a.student.person.lastName < b.student.person.lastName) return -1;
      if (a.student.person.lastName > b.student.person.lastName) return 1;
      if (a.student.person.lastName === b.student.person.lastName) {
        if (a.student.person.firstName < b.student.person.firstName) return -1;
        if (a.student.person.firstName < b.student.person.firstName) return 1;
      };
      return 0;
    });

    this.course.faculty.sort((a: FacultyInCourse, b: FacultyInCourse) => {
      if (a.facultyProfile.person.lastName < b.facultyProfile.person.lastName) return -1;
      if (a.facultyProfile.person.lastName > b.facultyProfile.person.lastName) return 1;
      if (a.facultyProfile.person.lastName === b.facultyProfile.person.lastName) {
        if (a.facultyProfile.person.firstName < b.facultyProfile.person.firstName) return -1;
        if (a.facultyProfile.person.firstName < b.facultyProfile.person.firstName) return 1;
      };
      return 0;
    });

    this.studentsPage = this.course.students.slice(0,50);
  }

  change(event: IPageChangeEvent): void {
    this.studentsPage = this.course.students.slice(event.fromRow, event.toRow);
  }


}
