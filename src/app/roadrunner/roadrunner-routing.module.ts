 import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserAuthGuard } from '../core/services/user-auth-guard.service';
import { RoadrunnerComponent }    from './roadrunner.component';
import { RoadrunnerDetailsComponent } from'./roadrunner-details/roadrunner-details.component';
import { FacultyAuthGuardService} from '../faculty/services/faculty-auth-guard.service';

const RoadrunnerRoutes: Routes = [
  { 
    path: 'roadrunnerStudent',  
    component: RoadrunnerComponent,
    canActivate: [UserAuthGuard] 
  },
  {
    path: 'roadrunnerFaculty',
    component: RoadrunnerComponent,
    canActivate: [FacultyAuthGuardService]
  },
  {
    path: 'roadrunnerStudent/:id',
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