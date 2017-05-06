import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { StudentAuthGuard } from './services/student-auth-guard.service';
import { StudentDataContext } from "./services/student-data-context.service";
import { GlobalService } from "../core/services/global.service";
import { StudentComponent } from './student.component';
import { AssessComponent } from "./shared/assess/assess.component";
import { CoursesComponent } from "./shared/courses/courses.component";
import { CourseComponent } from "./shared/course/course.component";
import { WorkgroupsComponent } from "./shared/workgroups/workgroups.component";
import { WorkgroupComponent } from "./shared/workgroup/workgroup.component";
import { ListComponent } from "./list/list.component";
import { ResultsComponent } from "./results/results.component";


const studentRoutes: Routes = [
  {
    path: 'student',
    //Check if role is student, spin up Student Data Context
    canActivate: [StudentAuthGuard], 
    children: [
      {
        path: 'assessment',
        component: StudentComponent,
        canActivateChild: [StudentAuthGuard],
        children: [
          {
            path: '',
            component: CoursesComponent,
            //Get the students courses
            //resolve: { courses: 'coursesResolver' },
          },
          {
            path: 'course/:id',
            //set to most recent course, allow student to switch between courses.
            component: CourseComponent,
            resolve: { course: 'courseResolver'},
            canActivateChild: [StudentAuthGuard],
            children: [
              {
                path: '',
                component: WorkgroupsComponent,
                //get the students groups for the course
                resolve: { workGroups: 'workGroupsResolver'},
              },
              {
                path: 'workgroup/:id',
                component: WorkgroupComponent,
                //set the most recent workGroup, allow student to switch between workgroups
                resolve: { workGroup: 'workGroupResolver'},
                canActivateChild: [StudentAuthGuard],
                children: [
                  {
                    path: 'list',
                    component: ListComponent,
                    //Show Assessments and stratifications if group is not published.
                    resolve: { list: 'listResolver'}
                  },
                  {
                    path: 'result',
                    component: ResultsComponent,
                    //show results if group is published
                    resolve: { result: 'resultsResolver'}
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// export function coursesResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.courses(route.params['course']);
// }

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
  providers: []
})
export class StudentRoutingModule { }