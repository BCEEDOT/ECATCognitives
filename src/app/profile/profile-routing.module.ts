import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent }    from './profile.component';
import { UserAuthGuard } from '../core/services/user-auth-guard.service';

const profileRoutes: Routes = [
  { 
    path: 'profile',  
    component: ProfileComponent,
    canActivate: [UserAuthGuard] 
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(profileRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileRoutingModule { }