import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { Course, WorkGroup } from "../core/entities/faculty";
import { FacultyDataContextService } from "./services/faculty-data-context.service"

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  courses$: Observable<Course[]>; 
  courses: Course[];
  activeCourse: Course;
  activeCourseId: number;

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    public media: TdMediaService,
    private facultyDataContext: FacultyDataContextService,
  ) { 
    this.courses$ = route.data.pluck('courses');
  }

  ngOnInit() {
    this.courses$.subscribe(courses => {
      this.courses = courses;
      console.log(this.courses);
      this.activate();
    })

  }

  activate(force?: boolean): void {

    this.courses.sort((crseA: Course, crseB: Course) => {
      if (crseA.startDate < crseB.startDate) return 1;
      if (crseA.startDate > crseB.startDate) return -1;
      return 0;
    });

    this.courses.forEach((course: Course) => course['displayName'] = `${course.classNumber}: ${course.name}`);

    this.activeCourse = this.courses[0];
    this.activeCourseId = this.activeCourse.id;

    this.router.navigate(['list', this.activeCourseId], { relativeTo: this.route })

  }

}
