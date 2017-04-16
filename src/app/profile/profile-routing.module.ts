import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent }    from './profile.component';
import { AuthGuard } from '../core/services/auth-guard.service';


const profileRoutes: Routes = [
  { 
    path: 'profile',  
    component: ProfileComponent,
    canActivate: [AuthGuard] 
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