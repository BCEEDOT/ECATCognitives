import { Component, AfterViewInit, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { TdDialogService, TdLoadingService } from "@covalent/core";
import 'rxjs/add/operator/pluck';

import { Course, WorkGroup } from '../core/entities/faculty';
import { FacultyDataContextService } from './services/faculty-data-context.service';
import { FacWorkgroupService } from "./services/facworkgroup.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit, OnDestroy {

  courses$: Observable<Course[]>;
  courses: Course[];
  activeCourse: Course;
  activeCourseId: number;
  onListView: boolean = true;
  viewSub: Subscription;

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
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

    this.viewSub = this.facWorkGroupService.onListView$.subscribe(value => {
      this.onListView = value;
    });
    this.titleService.setTitle('WorkGroup Center');
  }

  ngOnDestroy() {
    this.viewSub.unsubscribe();
  }

  setActiveCourse(course: Course): void {
    this.activeCourse = course;
    this.activeCourseId = this.activeCourse.id;
    this.facWorkGroupService.course(course);

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
    this.facWorkGroupService.course(this.activeCourse);

    this.router.navigate(['list', this.activeCourseId], { relativeTo: this.route });

  }

  refreshData() {
    this.loadingService.register();
    this.facultyDataContext.getActiveCourse(this.activeCourseId, true).then(res => {
      this.loadingService.resolve();
      this.setActiveCourse(res as Course);
    }).catch(error => {
      this.loadingService.resolve();
      this.dialogService.openAlert({message: 'Error refreshing Course list. Please try again.', title: 'Error Retrieving Course'});        
    });
  }

}
