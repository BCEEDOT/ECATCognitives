import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouteReuseStrategy, RouterModule, Routes } from '@angular/router';

import { StudentAuthGuard } from './services/student-auth-guard.service';
import { StudentDataContext } from "./services/student-data-context.service";
import { GlobalService } from "../core/services/global.service";
import { StudentComponent } from './student.component';
import { ListComponent } from "./list/list.component";
import { ResultsComponent } from "./results/results.component";
import { AssessComponent } from '../provider/sp-provider/assess/assess.component'

const studentRoutes: Routes = [
  {
    path: '',
    //Check if role is student, spin up Student Data Context
    canActivate: [StudentAuthGuard],
    children: [
      {
        path: 'assessment',
        component: StudentComponent,
        canActivateChild: [StudentAuthGuard],
        //Get the students courses
        resolve: { assess: 'assessmentResolver' },
        children: [
          // {
          //   path: '',
          //   component: AssessComponent,
          //   //Set active course and workgroup. Determine if results are published for active group. 
          // },

          {
            path: 'list/:crsId/:wrkGrpId',
            //set to most recent course, allow student to switch between courses.
            component: ListComponent,
            // children: [
            //   { path: 'sp', component: SpComponent},
            //   { path: 'comment', component: CommentComponent}
            // ]
            // resolve: { workGroup: 'workGroupResolver' },
          },
          {
            path: 'results/:crsId/:wrkGrpId',
            component: ResultsComponent,
            //resolve: { results: 'resultsResolver' },
          },
          {
            path: 'results/:crsId/:wrkGrpId/assess/:assesseeId',
            component: AssessComponent,
            resolve: { inventories: 'spAssessResolver' }
          },
          {
            path: 'list/:crsId/:wrkGrpId/assess/:assesseeId',
            component: AssessComponent,
            resolve: { inventories: 'spAssessResolver' }
          }, 
          //  {
          //    path: '',
          //    component: StudentComponent,
          //    pathMatch: 'full'
          // }
        ]
      }
    ]
  }
];

export function assessmentResolver(studentDataContext: StudentDataContext) {

  return (route: ActivatedRouteSnapshot) => {
    return studentDataContext.initCourses().then(courses => {
      return studentDataContext.fetchActiveWorkGroup(courses[0].workGroups[0].workGroupId).then(value => {
        return courses;
      });

    });
  }
}

// export function workGroupResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.fetchActiveWorkGroup(+route.params['wrkGrpId'])
// }

export function spAssessResolver(studentDataContext: StudentDataContext) {
  return (route: ActivatedRouteSnapshot) => studentDataContext.getSpInventory(+route.params['crsId'], +route.params['wrkGrpId'], +route.params['assesseeId']);
}

// export function courseResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.course(+route.params['id']);
// }

// export function workGroupsResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.workGroups(+route.parent.params['workgroup']);
// }

// export function workGroupResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.workgroup(+route.params['id']);
// }

// export function listResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.list(+route.params['id']);
// }

// export function resultsResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.results(+route.params['id']);
// }

@NgModule({
  imports: [
    RouterModule.forChild(studentRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: 'assessmentResolver', useFactory: assessmentResolver, deps: [StudentDataContext]
    },
    // {
    //   provide: 'workGroupResolver', useFactory: workGroupResolver, deps: [StudentDataContext]
    // },
    {
      provide: 'spAssessResolver', useFactory: spAssessResolver, deps: [StudentDataContext]
    }
  ]
})
export class StudentRoutingModule { }