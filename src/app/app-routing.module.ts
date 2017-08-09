import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'lti/ltiEntry', redirectTo: '/dashboard' }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    //Uses old style routing for older browsers eg... http://localhost/#/Home
    //RouterModule.forRoot(appRoutes, { useHash: true });
    //TODO: Enable tracing for production
    RouterModule.forRoot(appRoutes, {enableTracing: true})
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }