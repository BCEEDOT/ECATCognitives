import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from "@angular/material";

import { TdLoadingService } from '@covalent/core';
import { AuthService } from "../core/services/auth.service";
import { AuthUtilityService } from "../core/services/auth-utility.service";

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
    private loadingService: TdLoadingService, private authService: AuthService, private snackBar: MdSnackBar, private authUtility: AuthUtilityService) { }

  ngOnInit() {
    var ecatUserToken = localStorage.getItem('ecatUserToken');

    //check if user has a stored token
    if (this.authUtility.validateToken(ecatUserToken)) {
      this.router.navigate(['/dashboard']);
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
      this.snackBar.open(error, 'Close', {duration: 3000});
      console.log(error);
    });
  }
}
