import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { LmsadminAuthGuardService } from './services/lmsadmin-auth-guard.service';
import { LmsadminDataContextService } from './services/lmsadmin-data-context.service';
import { CoursesComponent } from './courses/courses.component';
import { GroupSetsComponent } from './group-sets/group-sets.component';
import { ManageGroupsetComponent } from './group-sets/manage-groupset/manage-groupset.component';
import { LmsadminComponent } from "./lmsadmin.component";
import { CourseEnrollComponent } from "./courses/course-enroll/course-enroll.component";
import { ConfigGroupsetComponent } from "./group-sets/config-groupset/config-groupset.component";
import { CourseInfoComponent } from "./courses/course-info/course-info.component";

const lmsadminRoutes: Routes = [
  { 
    path: 'lmsadmin',
    component: LmsadminComponent,
    // Check if role is ISA, spin up ISA Data Context
    canActivate: [LmsadminAuthGuardService],
    children: [
      {
        path: 'courses',
        component: CoursesComponent,
        canActivateChild: [LmsadminAuthGuardService],
        resolve: { courses: 'isaCoursesResolver' },
        children: [
          {
            path: ':crsId/enrollments',
            component: CourseEnrollComponent,
            //resolve: { course: 'lmsCourseResolver' }
          },
          {
            path: ':crsId/info',
            component: CourseInfoComponent,
            //resolve: { course: 'lmsCourseResolver' }
          },
          {
            path: ':crsId/groupsets',
            component: GroupSetsComponent,
            //resolve: { course: 'lmsCourseResolver' }
          },
          {
            path: ':crsId/groupsets/:catId/manage',
            component: ManageGroupsetComponent,
            //resolve: { course: 'lmsCourseResolver' }
          },
          {
            path: ':crsId/groupsets/:catId/config',
            component: ConfigGroupsetComponent,
            //resolve: { course: 'lmsCourseResolver' }
          },
        ]
      }
    ]
  }
]

export function isaCoursesResolver(lmsadminDataContext: LmsadminDataContextService) {
  return (route: ActivatedRouteSnapshot) => lmsadminDataContext.fetchAllCourses();
}

export function isaGroupsResolver(lmsadminDataContext: LmsadminDataContextService) {
  return (route: ActivatedRouteSnapshot) => lmsadminDataContext.fetchAllGroups(+route.params['crsId']);
}

@NgModule({
  imports: [
    RouterModule.forChild(lmsadminRoutes)
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    {
      provide: 'isaCoursesResolver', useFactory: isaCoursesResolver, deps: [LmsadminDataContextService]
    },
    {
      provide: 'isaGroupsResolver', useFactory: isaGroupsResolver, deps: [LmsadminDataContextService]
    }
  ]
})
export class LmsAdminRoutingModule { }