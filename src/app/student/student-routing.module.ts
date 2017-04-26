import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentAuthGuard } from './services/student-auth-guard.service';
import { StudentComponent }    from './student.component';
import { GlobalService } from "../core/services/global.service";

const studentRoutes: Routes = [
  { 
    path: 'student',  
    component: StudentComponent,
    canActivate: [StudentAuthGuard] 
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