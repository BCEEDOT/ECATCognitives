import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent }    from './users.component';
import { AuthGuard } from '../core/services/auth-guard.service';


const usersRoutes: Routes = [
  { 
    path: 'users',  
    component: UsersComponent,
    canActivate: [AuthGuard] 
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