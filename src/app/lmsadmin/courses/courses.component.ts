import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/pluck';

import { Course } from "../../core/entities/lmsadmin";
import { LmsadminDataContextService } from "../services/lmsadmin-data-context.service";
import { GlobalService } from "../../core/services/global.service";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Array<Course>>;
  courses: Array<Course>;

  constructor(private ctx: LmsadminDataContextService,
    private global: GlobalService,
    private router: Router,
    private route: ActivatedRoute,) {
      this.courses$ = route.data.pluck('courses');
    }

  ngOnInit() {
    this.courses$.subscribe(c => {
      this.courses = c;
      this.activate();
    })
  }

  activate(){
    this.courses.forEach(course => {
      course['displayStart'] = course.startDate.toDateString();
      course['displayGrad'] = course.gradDate.toDateString();
    })
  }

  refreshData() {
    this.ctx.fetchAllCourses(true).then(data => {
      this.courses = data;
      this.activate();
    })
  }

}
