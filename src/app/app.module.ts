import { NgModule, Type } from '@angular/core';
import { Http, RequestOptions } from "@angular/http";
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { JwtHelper, AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from "angular2-jwt";
import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';

import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";
import { UsersModule } from "./users/users.module";
import { StudentModule } from "./student/student.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ProfileModule } from "./profile/profile.module";
import { RoadrunnerModule } from "./roadrunner/roadrunner.module";
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from "./app-routing.module";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'ecatAccessToken',
    tokenGetter: (() => localStorage.getItem('ecatAccessToken')),
    noJwtError: true
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    BreezeBridgeAngularModule,
    SharedModule,
    CoreModule,
    BrowserModule,
    UsersModule,
    StudentModule,
    ProfileModule,
    DashboardModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RoadrunnerModule //Add feature modules/routes before main routing module
  ], // modules needed to run this module
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    Title,
    JwtHelper
  ], // additional providers needed for this module
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
   
    console.log('Routes', JSON.stringify(router.config, undefined, 2));
  }

}
