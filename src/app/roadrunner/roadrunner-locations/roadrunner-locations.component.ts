import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RoadRunner } from "../../core/entities/user";
import { RoadrunnerService } from '../services/roadrunner.service';



@Component({
  selector: 'roadrunner-locations',
  templateUrl: './roadrunner-locations.component.html',
  styleUrls: ['../roadrunner.component.scss']
})
export class RoadrunnerLocationsComponent implements OnInit {
  signedOut:boolean;
  roadRunnerEvent: RoadRunner;
  noRRs: boolean = false;

  @Input() roadRunnerInfos: RoadRunner[];

  @Output() signOut = new EventEmitter<RoadRunner>();

  constructor(private roadRunnerService:RoadrunnerService) { }

  ngOnInit() {
    this.roadRunnerService.signedOut$.subscribe(signedOut => {this.signedOut = signedOut});
    
    console.log(this.roadRunnerInfos);
  }

  signOutButton(location:RoadRunner){
    this.signOut.emit(location);
  }

}
