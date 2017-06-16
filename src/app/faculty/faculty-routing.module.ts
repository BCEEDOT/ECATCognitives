import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { FacultyAuthGuardService } from './services/faculty-auth-guard.service';
import { FacultyDataContextService } from './services/faculty-data-context.service';
import { WorkGroupsComponent } from './workgroups/work-groups.component';
import { FacultyComponent } from './faculty.component';
import { ListComponent } from './workgroups/list/list.component';
import { GlobalService } from '../core/services/global.service';
import { StatusComponent } from './workgroups/status/status.component'
import { EvaluateComponent } from './workgroups/evaluate/evaluate.component';
import { AssessComponent } from '../provider/sp-provider/assess/assess.component'
import { Course } from '../core/entities/faculty';

const facultyRoutes: Routes = [
  {
    path: 'faculty',
    // Check if role is student, spin up Student Data Context
    canActivate: [FacultyAuthGuardService],
    children: [
      {
        path: 'workgroups',
        component: FacultyComponent,
        canActivateChild: [FacultyAuthGuardService],
        // Get the students courses
        resolve: { courses: 'coursesResolver' },
            children: [
              // {
              //   path: '',
              //   component: AssessComponent,
              //   //Set active course and workgroup. Determine if results are published for active group. 
              // },

              {
                path: 'list/:crsId',
                // set to most recent course, allow student to switch between courses.
                component: ListComponent,
                // children: [
                //   { path: 'sp', component: SpComponent},
                //   { path: 'comment', component: CommentComponent}
                // ]
                resolve: { course: 'courseResolver' },
              },
              {
                path: 'list/:crsId/status/:wrkGrpId',
                component: StatusComponent,
                resolve: { workGroup: 'facWorkGroupResolver'}
              },
              {
                path: 'list/:crsId/evaluate/:wrkGrpId',
                component: EvaluateComponent,
                resolve: { workGroup: 'facWorkGroupResolver'}
              },
              // {
              //   path: 'results/:crsId/:wrkGrpId',
              //   component: ResultsComponent,
              //   //resolve: { results: 'resultsResolver' },
              // },
              {
                path: 'list/:crsId/evaluate/:wrkGrpId/assess/:assesseeId',
                component: AssessComponent,
                resolve: { inventories: 'facSpAssessResolver' }
              },
              // {
              //   path: '',
              //   component: StudentComponent,
              //   resolve: { assess: 'assessmentResolver'},
              //}

            ]
          }
        ]
      }
    ]


export function coursesResolver(facultyDataContext: FacultyDataContextService){
   return (route: ActivatedRouteSnapshot) => facultyDataContext.initCourses();
 }

export function courseResolver(facultyDataContext: FacultyDataContextService) {
  return (route: ActivatedRouteSnapshot) => facultyDataContext.getActiveCourse(+route.params['crsId']);
}

export function facSpAssessResolver(facultyDataContext: FacultyDataContextService) {
  return (route: ActivatedRouteSnapshot) => facultyDataContext.getFacSpInventory(+route.params['crsId'], 
+route.params['wrkGrpId'], +route.params['assesseeId']);
}

// export function courseResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.course(+route.params['id']);
// }

// export function workGroupsResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.workGroups(+route.parent.params['workgroup']);
// }

export function facWorkGroupResolver(facultyDataContext: FacultyDataContextService) {
  return (route: ActivatedRouteSnapshot) => facultyDataContext.fetchActiveWorkGroup(+route.params['crsId'], +route.params['wrkGrpId']);
}

// export function listResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.list(+route.params['id']);
// }

// export function resultsResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.results(+route.params['id']);
// }

@NgModule({
  imports: [
    RouterModule.forChild(facultyRoutes)
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    {
      provide: 'coursesResolver', useFactory: coursesResolver, deps: [FacultyDataContextService]
    },
    {
      provide: 'courseResolver', useFactory: courseResolver, deps: [FacultyDataContextService]
    },
    {
      provide: 'facWorkGroupResolver', useFactory: facWorkGroupResolver, deps: [FacultyDataContextService]
    },
    {
      provide: 'facSpAssessResolver', useFactory: facSpAssessResolver, deps: [FacultyDataContextService]
    }
  ]
})
export class FacultyRoutingModule { }
