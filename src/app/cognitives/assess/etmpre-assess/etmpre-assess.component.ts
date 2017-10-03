import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { CogInstrument, CogInventory, CogResponse } from "../../../core/entities/user";
import { CogAssessService } from "../../services/cog-assess.service";

@Component({
  selector: 'etmpre-assess',
  templateUrl: './etmpre-assess.component.html',
  styleUrls: ['./etmpre-assess.component.scss']
})
export class EtmpreAssessComponent implements OnInit, OnDestroy {

  etmpreInventories: CogInventory[]
  activeInventory: CogInventory;
  inventories: CogInventory[];
  sub1 = new Subscription();
  sub2 = new Subscription();

  constructor(private cogAssessService: CogAssessService) { }

  ngOnInit() {
    this.sub1 = this.cogAssessService.cogInventories$.subscribe((cogInventories: CogInventory[]) => {
      this.etmpreInventories = cogInventories;
      this.activate();
    });
    this.sub2 = this.cogAssessService.cogActiveInventory$.subscribe((cogInventory: CogInventory) => {
      this.activeInventory = cogInventory;
    })
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    // this.cogAssessService.cogActiveInventory(null);
    // this.cogAssessService.cogInventories(null);

    // this.cogAssessService.cogActiveInventory$.unsubscribe();
    // this.cogAssessService.cogInventories$.unsubscribe();
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
