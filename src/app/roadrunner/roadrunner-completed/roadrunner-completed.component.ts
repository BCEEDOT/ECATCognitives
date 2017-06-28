import { Component, OnInit, Input } from '@angular/core';
import { RoadrunnerService } from '../services/roadrunner.service';
import { RoadRunner } from "../../core/entities/user";

@Component({
  selector: 'roadrunner-completed',
  templateUrl: './roadrunner-completed.component.html',
  styleUrls: ['../roadrunner.component.scss']
})
export class RoadrunnerCompletedComponent implements OnInit {
count:number;
  @Input() roadRunnerInfos: RoadRunner[];

  constructor( private roadRunnerService:RoadrunnerService) { }

  ngOnInit() {

    this.roadRunnerService.count$.subscribe(count => {this.count = count});
    console.log(this.roadRunnerInfos);
  }
}
