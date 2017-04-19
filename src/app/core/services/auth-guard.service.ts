import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { AuthService } from './auth.service';
import { AuthUtilityService } from "./auth-utility.service";
import { EmProviderService } from "./em-provider.service";
import { UserRegistrationHelper } from "../entities/user";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, 
  private router: Router, private authUtility: AuthUtilityService, 
  private emProvider: EmProviderService, private regHelper: UserRegistrationHelper) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let ecatAccessToken = localStorage.getItem('ecatAccessToken')
    let ecatUserIdToken = localStorage.getItem('ecatUserIdToken');
    
    //TODO: Rewrite this to handle errors better
    //check if user has a stored token
    if (this.authUtility.validateToken(ecatAccessToken)) {
      return <any>this.emProvider.prepare("user", this.regHelper)
              .then(() => this.authUtility.login(ecatUserIdToken, ecatAccessToken))
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
