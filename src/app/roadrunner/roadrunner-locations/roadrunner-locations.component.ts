import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { CovalentMessageModule } from '@covalent/core';
import { RoadRunner } from "../../core/entities/user";
import { RoadrunnerService } from '../services/roadrunner.service';

//import { RoadrunnerComponent } from '../roadrunner.component';

@Component({
  selector: 'roadrunner-locations',
  templateUrl: './roadrunner-locations.component.html',
  styleUrls: ['../roadrunner.component.scss']
})
export class RoadrunnerLocationsComponent implements OnInit {
  signedOut:boolean;
  roadRunnerEvent: RoadRunner;

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
  //   signOut(edit): void {

  //   if (edit.signOut) {
  //     edit.prevSignOut = true;
  //     this.count = this.count + 1;
  //     this.roadRunnerInfos.forEach(element => {
  //       element['signedOutSomewhere'] = false;
  //     });
  //   } else {
  //     this.roadRunnerInfos.forEach(element => {
  //       element['signedOutSomewhere'] = true;
  //     });
  //   }

  //   edit.signOut = !edit.signOut;
  //   this.loadingService.register(this.roadRunnerLoading);
  //   this.userDataContext.commit()
  //     .then((res) => {
  //       this.loadingService.resolve(this.roadRunnerLoading);
  //     })
  //   this.roadRunnerInfos.sort((x, y) => { if (y.signOut === true) return 1; });

  // }
}
