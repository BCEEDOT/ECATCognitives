import { Subscriber, Subscription } from 'rxjs/Rx';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import {
  RouterModule, Routes, Router,
  ActivatedRouteSnapshot, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { TdLoadingService } from "@covalent/core";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeAll';

import { TdDialogService } from '@covalent/core';
import { GlobalService, ILoggedInUser } from './core/services/global.service';
import { Person } from './core/entities/user/person';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'ecat-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

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

    router.events.
      filter((e: Event) => isStart(e) || isEnd(e))
      .map((e: Event) => isStart(e))
      .distinctUntilChanged()
      .subscribe((showLoader: boolean) => {
        if (showLoader) {
          this.loadingService.register();
        } else {
          this.loadingService.resolve();
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
      const events: Event[] = [];
      const sub: Subscription = obs.subscribe((e: Event) => {
        events.push(e);
        if (isEnd(e)) {
          observer.next(events);
          observer.complete();
        }
      });
      return new Observable<Event[]>((o: Subscriber<Event[]>) => observer = o);
    }
  }

  ngOnInit(): void {

    this.global.persona.subscribe((user: ILoggedInUser) => {
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

  ngAfterViewInit(): void {
    // there has to be a better way to do this
    // TODO: Implement error handling
    if (this.tokenRef.nativeElement.ownerDocument.body.children[0].tagName === 'ECAT-APP') {
      // if we aren't coming through LTI the first child seems to be the ECAT-APP element that contains the angular version
      return;
    }

    let viewBag: string = this.tokenRef.nativeElement.ownerDocument.body.children[0].attributes[1].value;

    if (viewBag !== '') {
      let vBData = JSON.parse(viewBag);
      localStorage.setItem('ecatAccessToken', vBData.access_token);
      localStorage.setItem('ecatUserIdToken', vBData.id_token);
    } else {
      // if the first attribute is empty it means we had an error, which will be in the second
      viewBag = this.tokenRef.nativeElement.ownerDocument.body.children[0].attributes[2].value;
      this.dialogService.openAlert({
        message: 'There was an error logging you in. ' + viewBag,
        title: 'Please try again',
        // closeButton: 'Dismiss'
      });
    }

  }

  logout(): void {
    this.authService.logout();
  }

}
