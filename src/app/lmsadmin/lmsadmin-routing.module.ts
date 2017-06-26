import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { LmsadminAuthGuardService } from './services/lmsadmin-auth-guard.service';
import { LmsadminDataContextService } from './services/lmsadmin-data-context.service';
import { GroupManagementComponent } from './group-management/group-management.component';
import { CoursesComponent } from './group-management/courses/courses.component';
import { GroupsComponent } from './group-management/groups/groups.component';
import { LmsadminComponent } from "./lmsadmin.component";

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
        //   {
        //     path: ':crsId/enrollments',
        //     component: CourseEnrollmentsComponent,
        //     resolve: { course: 'lmsCourseResolver' }
        //   },
        ]
      },
      {
        path: 'groups',
        component: GroupManagementComponent,
        canActivateChild: [LmsadminAuthGuardService],
        resolve: { groups: 'isaGroupsResolver' },
        children: [
        //   {
        //     path: ':crsId/sets',
        //     component: CourseEnrollmentsComponent,
        //     resolve: { course: 'lmsCourseResolver' }
        //   },
        //   {
        //     path: ':crsId/sets/:catId/manage',
        //     component: CourseEnrollmentsComponent,
        //     resolve: { course: 'lmsCourseResolver' }
        //   },
        ]
      },
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