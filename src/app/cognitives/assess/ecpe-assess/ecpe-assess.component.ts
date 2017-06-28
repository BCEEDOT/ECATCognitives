import { Component, OnInit } from '@angular/core';
import { BaseChartComponent } from '@swimlane/ngx-charts/release';

import { BaseAssessService } from "../services/base-assess.service";
import { CogInstrument, CogInventory, CogResponse } from "../../../core/entities/user";
import { CogAssessService } from "../../services/cog-assess.service";

@Component({
  selector: 'ecpe-assess',
  templateUrl: './ecpe-assess.component.html',
  styleUrls: ['./ecpe-assess.component.scss']
})
export class EcpeAssessComponent implements OnInit {

  ecpeInstrument: CogInstrument[]
  activeInventory: CogInventory;
  inventories: CogInventory[];

  constructor(private cogAssessService: CogAssessService) { 
  }

  ngOnInit(): void {
    this.cogAssessService.cogInstrument$.subscribe((cogInstrument: CogInstrument[]) => {
      this.ecpeInstrument = cogInstrument;
      this.activate();
    });

    this.cogAssessService.cogActiveInventory$.subscribe((cogInventory: CogInventory) => {
      this.activeInventory = cogInventory;
    })

  }

  activate(): void {
    console.log(this.ecpeInstrument);
    this.inventories = this.ecpeInstrument[0].inventoryCollection;
    this.activeInventory = this.inventories[0];
    this.cogAssessService.cogActiveInventory(this.activeInventory);
  }

  nextInventory(): void {
    this.cogAssessService.nextInventory();

  }

  previousInventory(): void {
    this.cogAssessService.previousInventory();
  }



}
