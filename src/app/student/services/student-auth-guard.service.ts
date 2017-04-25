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

import { AuthService } from '../../core/services/auth.service';
import { AuthUtilityService } from "../../core/services/auth-utility.service";
import { EmProviderService } from "../../core/services/em-provider.service";
import { StudentRegistrationHelper } from "../../core/entities/student";
import { DataContext, ResourceEndPoint } from "../../app-constants";
import { GlobalService } from "../../core/services/global.service";

@Injectable()
export class StudentAuthGuard implements CanActivate {

  studentContextActivated = false;

  constructor(private authService: AuthService,
    private router: Router, private authUtility: AuthUtilityService,
    private emProvider: EmProviderService, private regHelper: StudentRegistrationHelper,
    private global: GlobalService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    console.log(this.global.isStudent);
    //First check if a user has a token and if it is expired
    if (tokenNotExpired('ecatAccessToken') && this.studentContextActivated && this.global.isStudent) {

      return true;

    } else if(this.global.isStudent) {
      
      return this.activate(url);

    } else {
      this.router.navigate(['/dashboard']);
      console.log("Your are not a student");
    }
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   return this.canActivate(route, state);
  // }

  // canLoad(route: Route): boolean {
  //   let url = `/${route.path}`;

  //   return this.activate(url);
  // }

  activate(url: string): boolean {
    //TODO: Rewrite this to handle errors better
    //check if user has a stored token
    if (tokenNotExpired('ecatAccessToken')) {
      return <any>this.emProvider.prepare(DataContext.Student, this.regHelper, ResourceEndPoint.Student)
        .then(() => {
          console.log('Student Context Activated');
          this.studentContextActivated = true;
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
