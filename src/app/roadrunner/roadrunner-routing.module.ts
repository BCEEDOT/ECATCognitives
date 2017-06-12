 import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserAuthGuard } from '../core/services/user-auth-guard.service';
import { RoadrunnerComponent }    from './roadrunner.component';
import { RoadrunnerDetailsComponent } from'./roadrunner-details/roadrunner-details.component';

const RoadrunnerRoutes: Routes = [
  { 
    path: 'roadrunner',  
    component: RoadrunnerComponent,
    canActivate: [UserAuthGuard] 
  },
  {
    path: 'roadrunner/:id',
    component: RoadrunnerDetailsComponent
    //resolve: { rr: rrResolver}
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