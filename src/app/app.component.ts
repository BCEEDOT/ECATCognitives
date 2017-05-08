import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { TdDialogService } from '@covalent/core';

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
  @ViewChild('tokenref') tokenRef: ElementRef;

  constructor(private _iconRegistry: MdIconRegistry,
    private _domSanitizer: DomSanitizer,
    private global: GlobalService,
    private authService: AuthService,
    private dialogService: TdDialogService) {
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

  ngAfterViewInit() {
    //there has to be a better way to do this
    //TODO: Implement error handling
    var viewBag = this.tokenRef.nativeElement.ownerDocument.body.children[0].attributes[1].value;
    if (viewBag !== '') {
      var vBData = JSON.parse(viewBag);
      localStorage.setItem('ecatAccessToken', vBData.access_token);
      localStorage.setItem('ecatUserIdToken', vBData.id_token);
    } else {
      //if the first attribute is empty it means we had an error, which will be in the second
      viewBag = this.tokenRef.nativeElement.ownerDocument.body.children[0].attributes[2].value;
      this.dialogService.openAlert({
        message: 'There was an error logging you in. ' + viewBag,
        title: 'Please try again',
        //closeButton: 'Dismiss'
      });
    }
    
  }

  logout() {
    this.authService.logout();
  }

}
