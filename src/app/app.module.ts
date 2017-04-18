import { NgModule, Type } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { CovalentCoreModule } from '@covalent/core';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';

import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";
import { UsersModule } from "./users/users.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ProfileModule } from "./profile/profile.module";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


import { AppRoutingModule } from "./app-routing.module";

import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';
import { RequestInterceptor } from '../config/interceptors/request.interceptor';

const httpInterceptorProviders: Type<any>[] = [
    RequestInterceptor,
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    BreezeBridgeAngularModule,
    SharedModule, 
    CoreModule, 
    BrowserModule,
    UsersModule,
    ProfileModule,
    DashboardModule,
    BrowserAnimationsModule,
    AppRoutingModule, //Add feature modules/routes before main routing module
    CovalentHttpModule.forRoot({
            interceptors: [{
                interceptor: RequestInterceptor, paths: ['breeze/**'],
            }],
        })

  ], // modules needed to run this module
  providers: [
    httpInterceptorProviders,
    Title,
  ], // additional providers needed for this module
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    console.log('Routes', JSON.stringify(router.config, undefined, 2));
  }

}
