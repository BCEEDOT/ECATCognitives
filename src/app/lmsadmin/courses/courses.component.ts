import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { TdDialogService, TdLoadingService } from "@covalent/core";
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
  isLoading: boolean = false;

  constructor(private ctx: LmsadminDataContextService,
    private global: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService) {
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

  pollCourses() {
    this.loadingService.register();
    this.ctx.pollCourses().then(data => {
      this.loadingService.resolve();
      this.courses = this.ctx.cachedCourses();
      
      this.dialogService.openAlert({
        message: 'Courses Added: ' + data.numAdded,
        title: 'Poll Complete',
        closeButton: 'Dismiss'
      });

      this.activate();
    }).catch((e: Event) => {
      console.log('Error retrieving courses ' + e);
      this.dialogService.openAlert({
        message: 'Error polling LMS for courses. Please try again.',
        title: 'Poll Error',
        closeButton: 'Dismiss'
      });
    });
  }

}
