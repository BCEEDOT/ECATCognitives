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


  }

  logout(): void {
    this.authService.logout();
  }

}
