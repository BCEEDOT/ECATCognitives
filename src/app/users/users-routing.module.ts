import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent }    from './users.component';
import { UsersFormComponent }  from './form/form.component';

const usersRoutes: Routes = [
  { path: 'users',  component: UsersComponent },
  { path: 'users/:id', component: UsersFormComponent }
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