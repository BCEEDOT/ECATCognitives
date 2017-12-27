import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService } from '@covalent/core';

import { GlobalService } from "../core/services/global.service";
import { AuthService } from "../core/services/auth.service";
import { AuthUtilityService } from "../core/services/auth-utility.service";
// import { tokenNotExpired, } from "angular2-jwt";

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
    private global: GlobalService,
    private authUtility: AuthUtilityService) { }

  ngOnInit() {

    let token = localStorage.getItem('ecatCogAccessToken');
    // check if user has a stored token and it is still valid
    if (token) {
      this.router.navigate(['/dashboard']);
    }

  }

  login(): void {

    this.loadingService.register();


    this.authService.login(this.password).subscribe(result => {
      if (result === true) {
        this.loadingService.resolve();
        this.router.navigate(['/cognitives']);
      } else {
        // TODO: Replace with correct error dialog box
        alert('Access Code Invalid');
        this.loadingService.resolve();
      }
    }, (error: any) => {
      this.loadingService.resolve();
      this.global.showSnackBar(error);
    });
  }
}
