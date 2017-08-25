import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subscription } from "rxjs/Subscription";

import { RoadRunner } from "../../core/entities/user";
import { RoadrunnerService } from '../services/roadrunner.service';

@Component({
  selector: 'roadrunner-locations',
  templateUrl: './roadrunner-locations.component.html',
  styleUrls: ['../roadrunner.component.scss']
})
export class RoadrunnerLocationsComponent implements OnInit, OnDestroy {
  signedOut:boolean;
  soSub: Subscription;
  roadRunnerEvent: RoadRunner;
  noRRs: boolean = false;

  @Input() roadRunnerInfos: RoadRunner[];

  @Output() signOut = new EventEmitter<RoadRunner>();

  constructor(private roadRunnerService:RoadrunnerService) { }

  ngOnInit() {
    this.soSub = this.roadRunnerService.signedOut$.subscribe(signedOut => {this.signedOut = signedOut});
    
    console.log(this.roadRunnerInfos);
  }

  ngOnDestroy() {
    this.soSub.unsubscribe();
  }

  signOutButton(location:RoadRunner){
    this.signOut.emit(location);
  }

}
