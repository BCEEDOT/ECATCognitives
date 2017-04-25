import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from "angular2-jwt";

import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { AuthUtilityService } from "./auth-utility.service";
import { Person } from "../entities/user";
import { GlobalService } from "./global.service";

@Injectable()
export class AuthService implements IHttpInterceptor {
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  //public token: string;

  constructor(private http: Http, private router: Router, private global: GlobalService, private jwtHelper: JwtHelper) { }

  login(username: string, password: string): Observable<boolean> {

    //let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    //let options = new RequestOptions({ headers: headers });
    let data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('username', username);
    data.append('password', password);

    return this.http.post('http://localhost:62187/connect/token',
      data).map((response: Response) => {
        let accessToken = response.json().access_token;
        let idToken = response.json().id_token;
        if (accessToken && idToken) {
          localStorage.setItem('ecatAccessToken', accessToken);
          localStorage.setItem('ecatUserIdToken', idToken);

          this.activateUser(idToken, accessToken);
          return true;
        } else {

          return false;
        }
      }).catch(this.handleError)
  }

  private handleError(error: Response | any) {

    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      if (err === 'invalid_grant') {
        return Observable.throw('Invalid username and password');
      }
      //errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      errMsg = 'An error occured. Please try again';
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }

  private activateUser(ecatUserIdToken: any, ecatAccessToken: any) {

    let accessToken = this.jwtHelper.decodeToken(ecatAccessToken);
    let idToken = this.jwtHelper.decodeToken(ecatUserIdToken);

    var loggedInUser = {
      personId: accessToken.sub,
      lastName: idToken.lastName,
      firstName: idToken.firstName,
      isActive: true,
      mpGender: idToken.mpGender,
      mpAffiliation: idToken.mpAffiliation,
      mpPaygrade: idToken.mpPaygrade,
      mpComponent: idToken.mpComponent,
      email: idToken.email,
      registrationComplete: true,
      mpInstituteRole: idToken.mpInstituteRole
    } as Person;

    this.global.user(loggedInUser);
    this.global.isLoggedIn(true);
    this.global.isFaculty(false);
    this.global.isStudent(true);
    this.global.isLmsAdmin(false);
  }

  logout() {
    localStorage.removeItem('ecatAccessToken');
    localStorage.removeItem('ecatUserIdToken');
    this.router.navigate(['/login']);
  }
}

