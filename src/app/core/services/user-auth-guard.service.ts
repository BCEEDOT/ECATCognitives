import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { tokenNotExpired } from "angular2-jwt";
import { EntityState } from 'breeze-client';

import { AuthService } from './auth.service';
import { AuthUtilityService } from "./auth-utility.service";
import { EmProviderService } from "./em-provider.service";
import { UserRegistrationHelper } from "../entities/user";
import { DataContext, ResourceEndPoint } from "../../app-constants";
import { GlobalService } from "./global.service";

@Injectable()
export class UserAuthGuard implements CanActivate {


  constructor(private authService: AuthService,
    private router: Router, private authUtility: AuthUtilityService,
    private emProvider: EmProviderService, private regHelper: UserRegistrationHelper,
    private global: GlobalService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let url: string = state.url;

    //First check if a user has a token and if it is expired
    if (tokenNotExpired('ecatAccessToken') && this.global.userDataContextActivated.value) {

      return true;

    } else {
      
      return this.activate(url);
    }
  }


  activate(url: string): boolean {
    //TODO: Rewrite this to handle errors better
    //check if user has a stored token
    if (tokenNotExpired('ecatAccessToken')) {
      return <any>this.emProvider.prepare(DataContext.User, this.regHelper, ResourceEndPoint.User)
        .then(() => {
          console.log('User Context Activated');
          this.global.userDataContext(true);
          this.authService.activateUser();
          if (!this.global.persona.value.person.registrationComplete) {
            this.router.navigate(['/profile']);
            return false;
          }

          return true;
        })
        .catch(e => {
          console.log('Error creating user em' + e);
          if (e.status == 401) {
            this.router.navigate(['/login']);
            return false;
          }
        })

    }

    this.router.navigate(['/login']);
    return false;
  }



}
