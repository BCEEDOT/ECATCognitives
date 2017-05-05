import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentAuthGuard } from './services/student-auth-guard.service';
import { StudentComponent } from './student.component';
import { GlobalService } from "../core/services/global.service";
import { AssessComponent } from "./assess/assess.component";
import { StratComponent } from "./strat/strat.component";

const studentRoutes: Routes = [
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [StudentAuthGuard],
    children: [
      {
        path: 'assessment',
        component: listComponent,
        //canActivateChild: [StudentAuthGuard],
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: AssessComponent },
          { path: 'strat', component: StratComponent }

        ]
      },
      {
        path: 'results',
        component: ResultComponent,
        children: [
          { path: '', redirectTo: 'assess', pathMatch: 'full' },
          { path: 'assessment', component: AssessResultComponent },
          { path: 'behavior', component: BehaviorResultComponent },
          { path: 'comment', component: CommentResultComponent },
        ]
      }
    ]
  }
];
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