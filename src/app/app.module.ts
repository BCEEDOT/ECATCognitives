import { NgModule, Type } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { CovalentCoreModule } from '@covalent/core';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';

import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { UsersModule } from "./users/users.module";

import { AppRoutingModule } from "./app-routing.module";

import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';
import { RequestInterceptor } from '../config/interceptors/request.interceptor';

const httpInterceptorProviders: Type<any>[] = [
    RequestInterceptor,
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    SharedModule,
    CoreModule,
    BrowserModule,
    UsersModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CovalentHttpModule.forRoot({
            interceptors: [{
                interceptor: RequestInterceptor, paths: ['**'],
            }],
        }),

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
