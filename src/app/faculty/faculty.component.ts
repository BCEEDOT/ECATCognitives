import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/pluck';

import { Course, WorkGroup } from '../core/entities/faculty';
import { FacultyDataContextService } from './services/faculty-data-context.service';
import { FacWorkgroupService } from "./services/facworkgroup.service";

@Component({
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  courses$: Observable<Course[]>;
  courses: Course[];
  activeCourse: Course;
  activeCourseId: number;
  onListView: boolean = true;

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private facultyDataContext: FacultyDataContextService,
    private facWorkGroupService: FacWorkgroupService,
  ) {
    this.courses$ = route.data.pluck('courses');
  }

  ngOnInit(): void {
    this.courses$.subscribe((courses: Course[]) => {
      this.courses = courses;
      this.activate();
    });

     this.facWorkGroupService.onListView$.subscribe(value => {
       this.onListView = value;
    });

  }

  setActiveCourse(course: Course): void {
    this.activeCourse = course;
    this.activeCourseId = this.activeCourse.id;

    this.router.navigate(['list', this.activeCourseId], { relativeTo: this.route });
    
  }

  activate(force?: boolean): void {

    //this.facWorkGroupService.onListView(true);

    this.courses.sort((crseA: Course, crseB: Course) => {
      if (crseA.startDate < crseB.startDate) { return 1; }
      if (crseA.startDate > crseB.startDate) { return -1; }
      return 0;
    });

    this.courses.forEach((course: Course) => course['displayName'] = `${course.classNumber}: ${course.name}`);

    this.activeCourse = this.courses[0];
    this.activeCourseId = this.activeCourse.id;

    this.router.navigate(['list', this.activeCourseId], { relativeTo: this.route });

  }

}
