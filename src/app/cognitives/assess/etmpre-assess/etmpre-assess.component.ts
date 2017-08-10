import { Component, OnInit } from '@angular/core';

import { CogInstrument, CogInventory, CogResponse } from "../../../core/entities/user";
import { CogAssessService } from "../../services/cog-assess.service";

@Component({
  selector: 'etmpre-assess',
  templateUrl: './etmpre-assess.component.html',
  styleUrls: ['./etmpre-assess.component.scss']
})
export class EtmpreAssessComponent implements OnInit {

  etmpreInventories: CogInventory[]
  activeInventory: CogInventory;
  inventories: CogInventory[];

  constructor(private cogAssessService: CogAssessService) { }

  ngOnInit() {
    this.cogAssessService.cogInventories$.subscribe((cogInventories: CogInventory[]) => {
      this.etmpreInventories = cogInventories;
      this.activate();
    });
    this.cogAssessService.cogActiveInventory$.subscribe((cogInventory: CogInventory) => {
      this.activeInventory = cogInventory;
    })
  }

  activate(): void {
    this.inventories = this.etmpreInventories;
    this.activeInventory = this.inventories[0];
    this.inventories.forEach(inv => {
      if (inv.response.itemScore == 0) {
        inv.response.itemScore = null;
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

  checkSave(): void {
    this.cogAssessService.checkReadyToSave();
  }

}
