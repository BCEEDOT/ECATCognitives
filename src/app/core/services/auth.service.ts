import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from "angular2-jwt";
import { EntityState } from 'breeze-client';

import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { AuthUtilityService } from "./auth-utility.service";
import { Person } from "../entities/user";
import { GlobalService, ILoggedInUser } from "./global.service";
import { EmProviderService } from "./em-provider.service";
import { DataContext } from "../../app-constants";
import { MpEntityType, MpInstituteRole } from "../common/mapStrings";

@Injectable()
export class AuthService implements IHttpInterceptor {
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  //public token: string;

  constructor(private http: Http, private router: Router, private global: GlobalService,
    private jwtHelper: JwtHelper, private emProvider: EmProviderService) { }

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

  public activateUser() {

    let accessTokenSigned = localStorage.getItem('ecatAccessToken');
    let idTokenSigned = localStorage.getItem('ecatUserIdToken');

    let accessToken = this.jwtHelper.decodeToken(accessTokenSigned);
    let idToken = this.jwtHelper.decodeToken(idTokenSigned);
    var user: ILoggedInUser = <ILoggedInUser>{};

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

    //user.person = loggedInUser;
    let entityUser = this.emProvider.getManager(DataContext.User).createEntity(MpEntityType.person, loggedInUser, EntityState.Unchanged);
    user.person = entityUser as Person;

    if (loggedInUser.mpInstituteRole === MpInstituteRole.student) {
      user.isFaculty = false;
      user.isStudent = true;
      user.isLmsAdmin = false;
    }

    if (loggedInUser.mpInstituteRole === MpInstituteRole.faculty) {
      user.isFaculty = true;
      user.isStudent = false;
      user.isLmsAdmin = false;
    }

    user.isProfileComplete = true;
    this.global.user(user);

    if (!user.isProfileComplete) {
      this.router.navigate(['/profile']);
    }
  
  }

  logout() {
    localStorage.removeItem('ecatAccessToken');
    localStorage.removeItem('ecatUserIdToken');
    this.router.navigate(['/login']);
  }
}

