import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { JwtHelper } from "angular2-jwt";
import { Router } from '@angular/router';

import 'rxjs/add/operator/map'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService implements IHttpInterceptor {
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  public token: string;
  jwtHelper: JwtHelper = new JwtHelper();


  constructor(private http: Http, private router: Router) {}

  login(username: string, password: string): Observable<boolean> {

    //let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    //let options = new RequestOptions({ headers: headers });
    let data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('username', username);
    data.append('password', password);

    return this.http.post('http://localhost:62187/connect/token',
      data).map((response: Response) => {
        let token = response.json().access_token;
        if (token) {
          localStorage.setItem('ecatUserToken', token);
          return true;
        } else {
          return false;
        }
      }).catch(this.handleError)
  }

  logout(): void {
    
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }
}

