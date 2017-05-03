import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { GlobalService, ILoggedInUser } from "./core/services/global.service";
import { Person } from "./core/entities/user/person";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: 'ecat-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  persona: ILoggedInUser = <ILoggedInUser>{};

  constructor(private _iconRegistry: MdIconRegistry,
    private _domSanitizer: DomSanitizer,
    private global: GlobalService,
    private authService: AuthService) {
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'github',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent-mark.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-ux.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'appcenter',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/appcenter.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'listener',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/listener.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'querygrid',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/querygrid.svg'));

  }

  ngOnInit() {

    console.log("App on init is firing");
    this.global.persona.subscribe((user) => {
     console.log("User has been updated in app Component")
      this.persona = user;
    });

    // this.global.user$.subscribe((user) => {
    //   this.persona = user;
    // });

    // this.global.isFaculty$.subscribe((role) => {
    //   this.isFaculty = role;
    // });


  }

  logout() {
    this.authService.logout();
  }

}
