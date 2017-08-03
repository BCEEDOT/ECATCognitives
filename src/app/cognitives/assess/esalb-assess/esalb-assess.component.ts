import { Component, OnInit } from '@angular/core';
import { BaseChartComponent } from '@swimlane/ngx-charts/release';

import { BaseAssessService } from "../services/base-assess.service";
import { CogInstrument, CogInventory, CogResponse } from "../../../core/entities/user";
import { CogAssessService } from "../../services/cog-assess.service";

@Component({
  selector: 'esalb-assess',
  templateUrl: './esalb-assess.component.html',
  styleUrls: ['./esalb-assess.component.scss']
})
export class EsalbAssessComponent implements OnInit {

  esalbInventories: CogInventory[]
  activeInventory: CogInventory;
  inventories: CogInventory[];
  cogName: string;

  constructor(private cogAssessService: CogAssessService) { }

  ngOnInit() {
    this.cogAssessService.cogInventories$.subscribe((cogInventories: CogInventory[]) => {
      this.esalbInventories = cogInventories;
      this.activate();
    });
    this.cogAssessService.cogActiveInventory$.subscribe((cogInventory: CogInventory) => {
      this.activeInventory = cogInventory;
    })
  }

  activate(): void {
    this.inventories = this.esalbInventories;
    this.activeInventory = this.inventories[0];
    this.inventories.forEach(inv => {
      if (inv.response.itemScore == 0) {
        inv.response.itemScore = 500;
      }
    });
    this.cogAssessService.cogActiveInventory(this.activeInventory);
  }

  nextInventory(): void {
    this.cogAssessService.nextInventory();
  }

  previousInventory(): void {
    this.cogAssessService.previousInventory();
  }

}
