import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { IPageChangeEvent, TdDialogService, TdLoadingService } from "@covalent/core";

import { Course, StudentInCourse, FacultyInCourse } from "../../../core/entities/lmsadmin";
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
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService) { }

  ngOnInit() {
    this.loadingService.register();
    this.route.params.subscribe(params => {
      let courseId: number = +params['crsId'];
      this.lmsadminDataContextService.fetchAllCourseMembers(courseId).then((course: Course) => {
        this.course = course;
        this.activate();
      });
    })
  }

  activate(){
    //this sort doesn't seem to be actually sorting on firstname properly
    this.course.students.sort((a: StudentInCourse, b: StudentInCourse) => {
      if (a.student.person.lastName < b.student.person.lastName) return -1;
      if (a.student.person.lastName > b.student.person.lastName) return 1;
      if (a.student.person.firstName > b.student.person.firstName) {return 1;}
      if (a.student.person.firstName < b.student.person.firstName) {return -1;}
      return 0;
    });

    this.course.faculty.sort((a: FacultyInCourse, b: FacultyInCourse) => {
      if (a.facultyProfile.person.lastName < b.facultyProfile.person.lastName) return -1;
      if (a.facultyProfile.person.lastName > b.facultyProfile.person.lastName) return 1;
      if (a.facultyProfile.person.firstName < b.facultyProfile.person.firstName) return -1;
      if (a.facultyProfile.person.firstName < b.facultyProfile.person.firstName) return 1;
      return 0;
    });

    this.studentsPage = this.course.students.slice(0,50);
    this.loadingService.resolve();
  }

  refreshData(){
    this.lmsadminDataContextService.fetchAllCourseMembers(this.course.id, true).then((course: Course) => {
      this.course = course;
      this.activate();
    });
  }

  change(event: IPageChangeEvent): void {
    this.studentsPage = this.course.students.slice(event.fromRow, event.toRow);
  }

  pollEnrollments() {
    console.log(this.course);
    this.loadingService.register();
    this.lmsadminDataContextService.pollCourseMembers(this.course.id).then(data => {
      this.loadingService.resolve();
      // this.course.students.push(...data.students);
      // this.course.faculty.push(...data.faculty);
      
      this.dialogService.openAlert({
        message: 'Accounts Created: ' + data.numOfAccountCreated + '\n Accounts Enrolled: ' + data.numAdded + '\n Accounts Disenrolled: ' + data.numRemoved,
        title: 'Poll Complete',
        closeButton: 'Dismiss'
      });
      
      this.activate();
    }).catch((e: Event) => {
      this.loadingService.resolve();
      console.log('Error retrieving course enrollments ' + e);
      this.dialogService.openAlert({
        message: 'Error polling LMS for enrollments. Please try again.',
        title: 'Poll Error',
        closeButton: 'Dismiss'
      });
    });
  }

}
