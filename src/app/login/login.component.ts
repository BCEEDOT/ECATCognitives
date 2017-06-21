import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from "@angular/material";
import { TdLoadingService } from '@covalent/core';

import { AuthService } from "../core/services/auth.service";
import { AuthUtilityService } from "../core/services/auth-utility.service";
import { tokenNotExpired } from "angular2-jwt";

@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  viewProviders: [AuthService]
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private router: Router,
              private loadingService: TdLoadingService, 
              private authService: AuthService, 
              private snackBar: MdSnackBar, 
              private authUtility: AuthUtilityService) { }

  ngOnInit() {

    //check if user has a stored token and it is still valid
    if (tokenNotExpired('ecatAccessToken')) {
      this.router.navigate(['/dashboard']);
    }

  }

  login(): void {

    this.loadingService.register();
    this.authService.login(this.username, this.password).subscribe(result => {
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
      this.snackBar.open(error, 'Close', { duration: 2000 });
      console.log(error);
    });
  }
}
