import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AgreementComponent } from "./agreement/agreement.component";
import { HelpComponent } from "./help/help.component";
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'agreement', component: AgreementComponent },
  { path: 'help', component: HelpComponent },
  { path: 'cognitives', loadChildren: './cognitives/cognitives.module#CognitivesModule'},
  { path: '', redirectTo: '/cognitives', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [
    // Uses old style routing for older browsers eg... http://localhost/#/Home
    // RouterModule.forRoot(appRoutes, { useHash: true });
    // TODO: Disable tracing for production
    // RouterModule.forRoot(appRoutes, {enableTracing: true})
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule,
  ],
  providers: [],
})
export class AppRoutingModule { }