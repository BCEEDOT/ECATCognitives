import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import {
  RouterModule, Routes, Router,
  ActivatedRouteSnapshot, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { TdLoadingService } from "@covalent/core";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeAll';

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

  persona: ILoggedInUser;
  isFaculty: boolean = false;
  isStudent: boolean = false;
  isLmsAdmin: boolean = false;
  cleanName: string;
  @ViewChild('tokenref') tokenRef: ElementRef;

  constructor(private _iconRegistry: MdIconRegistry,
    private router: Router,
    private loadingService: TdLoadingService,
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

    // router.events.subscribe(e => {

    // });

    // router.events.
    //   // Groups all events by id and returns Observable<Observable<Event>>.
    //   groupBy(e => e.id).
    //   // Reduces events and returns Observable<Observable<Event[]>>.
    //   // The inner observable has only one element.
    //   map(collectAllEventsForNavigation).
    //   // Returns Observable<Event[]>.
    //   mergeAll().
    //   subscribe((es: Event[]) => {
    //     console.log("navigation events", es);
    //   });


    //Point to nightly build of covalent and see if that fixes the issue. 
    router.events.
      filter(e => isStart(e) || isEnd(e))
      .map(e => isStart(e))
      .distinctUntilChanged()
      .subscribe(showLoader => {
        if (showLoader) {

          //Temporary workaround for Teradata beta5
          //Promise.resolve(null).then(() => {this.loadingService.register(); })
          this.loadingService.register();

          //console.log('loader ON');
        } else {
          //Temporary workaround for Teradata beta5
          //Promise.resolve(null).then(() => {this.loadingService.resolve(); })
          this.loadingService.resolve();
          //console.log('loader OFF');
        }
      });


    function isStart(e: Event): boolean {
      return e instanceof NavigationStart;
    }
    function isEnd(e: Event): boolean {
      return e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError;
    }

    function collectAllEventsForNavigation(obs: Observable<Event>):
      Observable<Event[]> {
      let observer: Observer<Event[]>;
      const events = [];
      const sub = obs.subscribe(e => {
        events.push(e);
        if (isEnd(e)) {
          observer.next(events);
          observer.complete();
        }
      });
      return new Observable<Event[]>(o => observer = o);
    }
  }

  ngOnInit() {

    this.global.persona.subscribe((user) => {
      console.log("User has been updated in app Component")
      this.persona = user;
      if (this.persona) {
        if (this.persona.person) {
          this.cleanName = `${this.persona.person.lastName}, ${this.persona.person.firstName}`;
          this.isStudent = this.persona.isStudent;
          this.isFaculty = this.persona.isFaculty;
          this.isLmsAdmin = this.persona.isLmsAdmin;
        }
      }
    });

  }

  ngAfterViewInit() {
    //there has to be a better way to do this
    //TODO: Implement error handling
    if (this.tokenRef.nativeElement.ownerDocument.body.children[0].tagName === 'ECAT-APP') {
      //if we aren't coming through LTI the first child seems to be the ECAT-APP element that contains the angular version
      return;
    }

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
