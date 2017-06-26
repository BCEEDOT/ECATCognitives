import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from "@angular/router";

import { tokenNotExpired } from "angular2-jwt/angular2-jwt";

import { ILoggedInUser, GlobalService } from "../../core/services/global.service";
import { AuthService } from "../../core/services/auth.service";
import { AuthUtilityService } from "../../core/services/auth-utility.service";
import { EmProviderService } from "../../core/services/em-provider.service";
import { FacultyRegistrationHelper } from "../../core/entities/faculty/regHelper";
import { DataContext, ResourceEndPoint } from "../../app-constants";

@Injectable()
export class LmsadminAuthGuardService implements CanActivate, CanActivateChild{
  lmsadminContextActivated = false;
  persona: ILoggedInUser;

  constructor(private authService: AuthService,
    private router: Router,
    private authUtility: AuthUtilityService,
    private emProvider: EmProviderService,
    private regHelper: FacultyRegistrationHelper,
    private global: GlobalService) { 
      this.global.persona.subscribe((data) => {
      this.persona = data;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    //First check if a user has a token and if it is expired
    if (tokenNotExpired('ecatAccessToken') && this.lmsadminContextActivated && this.persona.isLmsAdmin) {

      return true;

    } else if (this.persona.isLmsAdmin) {

      return this.activate(url);

    } else {
      this.router.navigate(['/dashboard']);
      console.log("Your are not an LMS Admin");
    }
    
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  activate(url: string): boolean {
    //TODO: Rewrite this to handle errors better
    //check if user has a stored token
    if (tokenNotExpired('ecatAccessToken')) {
      return <any>this.emProvider.prepare(DataContext.LmsAdmin, this.regHelper, ResourceEndPoint.LmsAdmin)
        .then(() => {
          console.log('LMS Admin Context Activated');
          this.lmsadminContextActivated = true;
          return true;
        })
        .catch(e => {
          console.log('Error creating user em' + e);
          if (e.status == 401) {
            this.router.navigate(['/login'], navigationExtras);
            return false;
          }
        })

    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Create a dummy session id
    let sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: { 'session_id': sessionId },
      fragment: 'anchor'
    };

    // Navigate to the login page with extras
    this.router.navigate(['/login'], navigationExtras);
    return false;
  }

}