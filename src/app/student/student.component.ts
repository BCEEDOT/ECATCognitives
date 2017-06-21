import { MpSpStatus } from '../core/common/mapStrings';
import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';

import { Course, WorkGroup } from "../core/entities/student";
import { WorkGroupService } from "./services/workgroup.service";
import { StudentDataContext } from "./services/student-data-context.service"
import { AssessCompareDialog } from './shared/assess-compare/assess-compare.dialog';

@Component({
  //Selector only needed if another template is going to refernece
  selector: 'ecat-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
  //Limits only to current view and not children
  //viewProviders: [ UsersService ],
})
export class StudentComponent implements OnInit {

  //courses: Observable<Course[]>;
  activeCourseId: number;
  courses$: Observable<Course[]>;
  courses: Course[];
  workGroups: WorkGroup[];
  activeCourse: Course;
  activeWorkGroup: WorkGroup;
  grpDisplayName = 'Not Set';
  assessIsLoaded = 'assessIsLoaded';

  dialogRef: MdDialogRef<AssessCompareDialog>;

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
    this.setActiveCourse(this.activeCourse, true);
  }

  ngOnInit(): void {

    this.titleService.setTitle('ECAT Users');
    this.courses$.subscribe(courses => {
      this.courses = courses;
      this.activate();
    });

  }

  private activate(force?: boolean): void {

    this.courses.sort((crseA: Course, crseB: Course) => {
      if (crseA.startDate < crseB.startDate) return 1;
      if (crseA.startDate > crseB.startDate) return -1;
      return 0;
    });

    this.courses.forEach(course => course['displayName'] = `${course.classNumber}: ${course.name}`);
    this.activeCourse = this.courses[0];
    this.activeCourseId = this.activeCourse.id;
    
    let activeWorkgroup = this.setupWorkGroups(this.activeCourse);
    
    this.setActiveWorkGroup(activeWorkgroup, force);
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

  private setupWorkGroups(course: Course): WorkGroup {
    this.workGroups = this.activeCourse.workGroups;

    this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
      if (wgA.mpCategory < wgB.mpCategory) return 1;
      if (wgA.mpCategory > wgB.mpCategory) return -1;
      return 0;
    });

    this.workGroups.forEach(wg => { wg['displayName'] = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });

    let activeWorkgroup = this.workGroups[0];

    return activeWorkgroup;
    
  } 

  private setActiveCourse(course: Course, force?: boolean): void {

    this.workGroupService.isLoading(true);

    this.studentDataContext.fetchActiveCourse(course.id, force)
      .then(course => {
        this.activeCourse = course as Course;
        let activeWorkGroup = this.setupWorkGroups(this.activeCourse);
        this.activeCourseId = this.activeCourse.id;
        this.setActiveWorkGroup(activeWorkGroup, force);
      }).catch(error => {
        console.log('There was an error retriving the active course');
      })
  }


  private setActiveWorkGroup(workGroup: WorkGroup, force?: boolean): void {

    this.workGroupService.isLoading(true);

    const workGroupId = (workGroup) ? workGroup.workGroupId : 0;

    this.studentDataContext.fetchActiveWorkGroup(workGroupId, false).then(workGroup => {
      this.activeWorkGroup = workGroup as WorkGroup;
      this.grpDisplayName = `${this.activeWorkGroup.mpCategory}: ${this.activeWorkGroup.customName || this.activeWorkGroup.defaultName}`;

      const resultsPublished = this.activeWorkGroup.mpSpStatus !== MpSpStatus.open;

      this.workGroupService.workGroup(this.activeWorkGroup);

      if (!force) {
        resultsPublished ? this.router.navigate(['results', this.activeCourseId, workGroupId], { relativeTo: this.route }) : this.router.navigate(['list', this.activeCourseId, workGroupId], { relativeTo: this.route });
      }
    });


  }











  // initCourses(): void {
  //   //maps to ng-template tag
  //   this.loadingService.register('course.list');
  //   this.studentDataContext.initCourses()
  //       .then((courses) => {
  //         this.courses = courses;
  //         this.loadingService.resolve('course.list');
  //         console.log(this.courses);
  //       })
  //       .catch(e => {
  //         this.loadingService.resolve('course.list');
  //         console.log('error getting users');
  //         console.log(e);
  //       })

  // }


  // loadUsers(): void {
  //   this._loadingService.register('users.list');
  //   this._usersService.query().subscribe((users: IUser[]) => {
  //     this.users = users;
  //     this.filteredUsers = users;
  //     this._loadingService.resolve('users.list');
  //   }, (error: Error) => {
  //     this._usersService.staticQuery().subscribe((users: IUser[]) => {
  //       this.users = users;
  //       this.filteredUsers = users;
  //       this._loadingService.resolve('users.list');
  //     });
  //   });
  // }

  // filterUsers(displayName: string = ''): void {
  //   this.filteredUsers = this.users.filter((user: IUser) => {
  //     return user.displayName.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
  //   });
  // }

  // deleteUser(id: string): void {
  //   this._dialogService
  //     .openConfirm({message: 'Are you sure you want to delete this user?'})
  //     .afterClosed().subscribe((confirm: boolean) => {
  //       if (confirm) {
  //         this._loadingService.register('users.list');
  //         this._usersService.delete(id).subscribe(() => {
  //           this.users = this.users.filter((user: IUser) => {
  //             return user.id !== id;
  //           });
  //           this.filteredUsers = this.filteredUsers.filter((user: IUser) => {
  //             return user.id !== id;
  //           });
  //           this._loadingService.resolve('users.list');
  //           this._snackBarService.open('User deleted', 'Ok');
  //         }, (error: Error) => {
  //           this._dialogService.openAlert({message: 'There was an error'});
  //           this._loadingService.resolve('users.list');
  //         });
  //       }
  //     });
  // }

}
