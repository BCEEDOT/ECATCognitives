 import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserAuthGuard } from '../core/services/user-auth-guard.service';
import { RoadrunnerComponent }    from './roadrunner.component';
import { RoadrunnerDetailsComponent } from'./roadrunner-details/roadrunner-details.component';
import { FacultyAuthGuardService} from '../faculty/services/faculty-auth-guard.service';

const RoadrunnerRoutes: Routes = [
  { 
    path: 'student',  
    component: RoadrunnerComponent,
    canActivate: [UserAuthGuard] 
  },
  {
    path: 'faculty',
    component: RoadrunnerComponent,
    canActivate: [FacultyAuthGuardService]
  },
  {
    path: 'student/:id',
    component: RoadrunnerDetailsComponent
  } 
];
@NgModule({
  imports: [
    RouterModule.forChild(RoadrunnerRoutes)
    
  ],
  exports: [
    RouterModule
  ]
})
export class RoadrunnerRoutingModule { }