import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from "angular2-jwt";

import { TdLoadingService } from '@covalent/core';
import { AuthService } from "../core/services/auth.service";

@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  viewProviders: [AuthService]
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router,
    private loadingService: TdLoadingService, private authService: AuthService) { }

  ngOnInit() {
    var ecatUserToken = localStorage.getItem('ecatUserToken');

    //check if user has a stored token
    if (ecatUserToken) {
      //make sure token is not expired
      if (this.jwtHelper.isTokenExpired(ecatUserToken)) {

        this.router.navigate(['/dashboard']);
        console.log(
          this.jwtHelper.decodeToken(ecatUserToken)
        )
      }
    }
  }

  login(): void {

    //TODO: Add code if username and password are bad.

    this.loadingService.register();
    this.authService.login(this.username, this.password).subscribe(result => {

      console.log(result);
      if (result === true) {
        this.loadingService.resolve();
        this.router.navigate(['/dashboard']);
      } else {
        //replace with correct message box
        alert('Login failed');
        this.loadingService.resolve();
      }
    }, (error: any) => {
      this.loadingService.resolve();
      console.log(error);
    });
  }
}
