import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: MainComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    //Uses old style routing for older browsers eg... http://localhost/#/Home
    //RouterModule.forRoot(appRoutes, { useHash: true });
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }