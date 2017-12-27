import { NgModule, Type } from '@angular/core';
// import { Http, RequestOptions } from "@angular/http";

// import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
// import { JwtModule } from '@auth0/angular-jwt';
// import { JwtHelper, AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from "angular2-jwt";
// import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';

import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";
// import { StudentModule } from "./student/student.module";
// import { FacultyModule } from "./faculty/faculty.module";
// import { DashboardModule } from "./dashboard/dashboard.module";
// import { ProfileModule } from "./profile/profile.module";
// import { RoadrunnerModule } from "./roadrunner/roadrunner.module";
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from "./app-routing.module";
import { CognitivesModule } from "./cognitives/cognitives.module";
// import { LmsadminModule } from "./lmsadmin/lmsadmin.module";

// export function authHttpServiceFactory(http: Http, options: RequestOptions) {
//   return new AuthHttp(new AuthConfig({
//     tokenName: 'ecatAccessToken',
//     tokenGetter: (() => localStorage.getItem('ecatAccessToken')),
//     noJwtError: true
//   }), http, options);
// }

export function tokenGetter() {
  return localStorage.getItem('ecatAccessToken');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    // BreezeBridgeAngularModule,
    // BreezeBridgeHttpClientModule,    
    //SharedModule with the MaterialModule needs to load after Browser and BrowserAnimations
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    //FacultyModule,
    //LmsadminModule,
    //StudentModule,
    //ProfileModule,
    //DashboardModule,
    AppRoutingModule,
    //RoadrunnerModule, //Add feature modules/routes before main routing module
    CognitivesModule, //Add feature modules/routes before main routing module
    // HttpClientModule,
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     whitelistedDomains: ['localhost:62187', 'ec2-34-237-207-101.compute-1.amazonaws.com'],
    //     throwNoTokenError: false,
    //     skipWhenExpired: true,
    //   },
    // }),
  ], // modules needed to run this module
  providers: [
    // {
    //   provide: AuthHttp,
    //   useFactory: authHttpServiceFactory,
    //   deps: [Http, RequestOptions]
    // },
    Title,
    // JwtHelper
  ], // additional providers needed for this module
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {

    // console.log('Routes', JSON.stringify(router.config, undefined, 2));
  }

}
