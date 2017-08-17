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
import { FlightRosterComponent } from './workgroups/flight-roster/flight-roster.component';
import { AssessComponent } from '../provider/sp-provider/assess/assess.component'
import { ResultsComponent } from "./workgroups/results/results.component";
import { Course } from '../core/entities/faculty';
import { ResultsDetailsComponent } from "./workgroups/results/results-details/results-details.component";
import { FacultySaveChangesGuard } from "./services/faculty-savechangesguard.service";

const facultyRoutes: Routes = [
  {
    path: '',
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

          {
            path: 'list/:crsId',
            // set to most recent course, allow student to switch between courses.
            component: ListComponent,
          },
          {
            path: 'list/:crsId/status/:wrkGrpId',
            component: StatusComponent,
            resolve: { workGroup: 'facStatusResolver' }
          },
          {
            path: 'list/:crsId/evaluate/:wrkGrpId',
            component: EvaluateComponent,
            resolve: { workGroup: 'facWorkGroupResolver' },
            canDeactivate: [FacultySaveChangesGuard],
          },

          {
            path: 'list/:crsId/flight-roster/:wrkGrpId',
            component: FlightRosterComponent,
            //resolve: { workGroup: 'facWorkGroupResolver' }
            //canDeactivate: [FacultySaveChangesGuard],
          },

          {
            path: 'list/:crsId/evaluate/:wrkGrpId/assess/:assesseeId',
            component: AssessComponent,
            resolve: { inventories: 'facSpAssessResolver' },
            canDeactivate: [FacultySaveChangesGuard],
          },
          {
            path: 'list/:crsId/results/:wrkGrpId',
            component: ResultsComponent,
          },
          {
            path: 'list/:crsId/results/:wrkGrpId/details/:stuId',
            component: ResultsDetailsComponent,
          },
          {
            path: '',
            component: FacultyComponent,
            resolve: { courses: 'coursesResolver' },
          }

        ]
      }
    ]
  }
]


export function coursesResolver(facultyDataContext: FacultyDataContextService) {
  return (route: ActivatedRouteSnapshot) => facultyDataContext.initCourses();
}

// export function courseResolver(facultyDataContext: FacultyDataContextService) {
//   return (route: ActivatedRouteSnapshot) => facultyDataContext.getActiveCourse(+route.params['crsId']);
// }

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

export function facStatusResolver(facultyDataContext: FacultyDataContextService) {
  return (route: ActivatedRouteSnapshot) => facultyDataContext.fetchActiveWorkGroup(+route.params['crsId'], +route.params['wrkGrpId'], true);
}

// export function listResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.list(+route.params['id']);
// }

// export function facFesultsResolver(facultyDataContext: FacultyDataContextService) {
//   return (route: ActivatedRouteSnapshot) => FacultyDataContextService.results(+route.params['id']);
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
    // {
    //   provide: 'courseResolver', useFactory: courseResolver, deps: [FacultyDataContextService]
    // },
    {
      provide: 'facWorkGroupResolver', useFactory: facWorkGroupResolver, deps: [FacultyDataContextService]
    },
    {
      provide: 'facSpAssessResolver', useFactory: facSpAssessResolver, deps: [FacultyDataContextService]
    },
    {
      provide: 'facStatusResolver', useFactory: facStatusResolver, deps: [FacultyDataContextService]
    }
  ]
})
export class FacultyRoutingModule { }
