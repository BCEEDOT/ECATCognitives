import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserAuthGuard } from '../core/services/user-auth-guard.service';
import { UsersComponent }    from './users.component';

const usersRoutes: Routes = [
  { 
    path: 'users',  
    component: UsersComponent,
    canActivate: [UserAuthGuard] 
  } 
];
@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UsersRoutingModule { }