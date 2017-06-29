import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent }    from './profile.component';
import { UserAuthGuard } from '../core/services/user-auth-guard.service';
import { UserSaveChangesGuard } from "../core/services/user-savechangesguard.service";

const profileRoutes: Routes = [
  { 
    path: 'profile',  
    component: ProfileComponent,
    canActivate: [UserAuthGuard],
    canDeactivate: [UserSaveChangesGuard] 
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