import { MpSpStatus } from '../core/common/mapStrings';
import { Component, AfterViewInit, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/pluck';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';

import { Course, WorkGroup } from "../core/entities/student";
import { WorkGroupService } from "./services/workgroup.service";
import { StudentDataContext } from "./services/student-data-context.service"
import { AssessCompareDialog } from './shared/assess-compare/assess-compare.dialog';
import { Subscription } from "rxjs/Subscription";

@Component({
  //Selector only needed if another template is going to refernece
  selector: 'ecat-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
  //Limits only to current view and not children
  //viewProviders: [ UsersService ],
})
export class StudentComponent implements OnInit, OnDestroy {

  activeCourseId: number;
  activeWorkGroupId: number;
  courses$: Observable<Course[]>;
  courses: Course[];
  workGroups: WorkGroup[];
  activeCourse: Course;
  activeWorkGroup: WorkGroup;
  grpDisplayName = 'Not Set';
  assessIsLoaded = 'assessIsLoaded';
  dialogRef: MdDialogRef<AssessCompareDialog>;
  onListView: boolean = true;
  viewSub: Subscription;

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    public media: TdMediaService,
    private workGroupService: WorkGroupService,
    private studentDataContext: StudentDataContext,
    public dialog: MdDialog, @Inject(DOCUMENT) doc: any) {

    this.courses$ = route.data.pluck('assess');

  }

  goBack(route: string): void {
    this.router.navigate(['/']);
  }

  refreshFromServer() {

    this.workGroupService.isLoading(true);
    if (this.activeCourse) {
      this.workGroupService.isLoading(false);
      this.setActiveCourse(this.activeCourse);
    } else {
      this.studentDataContext.initCourses().then(courses => {
        if (courses.length > 0) {
          if (courses[0].workGroups.length > 0) {
            this.studentDataContext.fetchActiveWorkGroup(courses[0].workGroups[0].workGroupId, true).then(workgroup => {
              this.workGroupService.isLoading(false);
              this.courses = courses;
              this.activate(false);
            }).catch(error => {
              this.workGroupService.isLoading(false);
              this.dialogService.openAlert({ message: 'There was a problem loading your work group, please try again.', title: 'Load Error' });
              this.workGroupService.isLoading(false);
            });
          } else {
            this.workGroupService.isLoading(false);
            this.courses = courses;
            this.activate(false);
          }
        } else {
          this.workGroupService.isLoading(false);
          this.courses = courses;
        }
      }).catch(error => {
        this.workGroupService.isLoading(false);
        this.dialogService.openAlert({ message: 'There was a problem loading your course, please try again.', title: 'Load Error' });
        this.workGroupService.isLoading(false);
      });
    }

  }

  ngOnDestroy(): void {
    this.workGroupService.workGroup(null);
    this.viewSub.unsubscribe();
  }

  ngOnInit(): void {

    this.titleService.setTitle('ECAT Users');
    this.courses$.subscribe(courses => {
      this.courses = courses;
      if (courses.length > 0) {

        this.activate(false);
      }
    });

    this.viewSub = this.workGroupService.onListView$.subscribe(value => {
      this.onListView = value;
    });

  }

  activate(force?: boolean): void {
    this.courses.sort((crseA: Course, crseB: Course) => {
      if (crseA.startDate < crseB.startDate) return 1;
      if (crseA.startDate > crseB.startDate) return -1;
      return 0;
    });

    this.courses.forEach(course => {
      course.displayName = course.classNumber + ": " + course.name;
    });

    this.activeCourse = this.courses[0];
    this.activeCourseId = this.activeCourse.id;

    if (this.activeCourse.workGroups.length > 0) {

      this.initWorkGroups(this.activeCourse.workGroups);
    }

  }

  initWorkGroups(workGroups: WorkGroup[]): void {

    this.workGroups = workGroups;
    this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
      if (wgA.mpCategory < wgB.mpCategory) return 1;
      if (wgA.mpCategory > wgB.mpCategory) return -1;
      return 0;
    });
    this.workGroups.forEach(wg => { wg.displayName = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });
    this.initActiveWorkGroup(this.workGroups[0]);
  }

  initActiveWorkGroup(workGroup: WorkGroup): void {
    this.activeWorkGroup = workGroup;
    this.activeWorkGroupId = this.activeWorkGroup.workGroupId;
    this.grpDisplayName = `${this.activeWorkGroup.mpCategory}: ${this.activeWorkGroup.customName || this.activeWorkGroup.defaultName}`;


    if (this.activeWorkGroup.groupMembers.length < 1) {
      this.setActiveWorkGroup(workGroup);
    } else {
      this.workGroupService.workGroup(this.activeWorkGroup);
      this.nav(this.activeWorkGroup);
    }

  }

  assessCompare(): void {

    this.dialogRef = this.dialog.open(AssessCompareDialog, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      width: '950px',
      height: '',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        workGroup: this.activeWorkGroup
      }
    });

  }

  setActiveCourse(course: Course): void {

    this.workGroupService.isLoading(true);

    this.studentDataContext.fetchActiveCourse(course.id, true)
      .then(course => {
        this.activeCourse = course as Course;
        this.activeCourseId = this.activeCourse.id;

        if (this.activeCourse.workGroups.length > 0) {
          this.initWorkGroups(this.activeCourse.workGroups);
        }
        this.workGroupService.isLoading(false);
      }).catch(error => {
        this.dialogService.openAlert({ message: 'There was a problem loading your course, please try again.', title: 'Load Error' });
        this.workGroupService.isLoading(false);

      });
  }

  nav(workGroup: WorkGroup): void {
    const resultsPublished = this.activeWorkGroup.mpSpStatus === MpSpStatus.published;

    resultsPublished ? this.router.navigate(['results', this.activeCourseId, this.activeWorkGroupId], { relativeTo: this.route }) : this.router.navigate(['list', this.activeCourseId, this.activeWorkGroupId], { relativeTo: this.route });

  }

  setActiveWorkGroup(workGroup: WorkGroup): void {

    //this.workGroupService.workGroup(this.activeWorkGroup);
    this.workGroupService.isLoading(true);

    this.studentDataContext.fetchActiveWorkGroup(workGroup.workGroupId, true).then(workGroup => {
      this.initActiveWorkGroup(workGroup as WorkGroup);
      this.workGroupService.isLoading(false);
    }).catch(error => {
      this.dialogService.openAlert({ message: 'There was a problem loading your Work Group, please try again.', title: 'Load Error' });
      this.workGroupService.isLoading(false);
    });

  }


}
