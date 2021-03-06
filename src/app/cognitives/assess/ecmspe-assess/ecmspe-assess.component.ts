import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseChartComponent } from '@swimlane/ngx-charts/release';
import { Subscription } from 'rxjs/Rx';

import { BaseAssessService } from "../services/base-assess.service";
import { CogInstrument, CogInventory, CogResponse } from "../../../core/entities/user";
import { CogAssessService } from "../../services/cog-assess.service";

@Component({
  selector: 'ecmspe-assess',
  templateUrl: './ecmspe-assess.component.html',
  styleUrls: ['./ecmspe-assess.component.scss']
})
export class EcmspeAssessComponent implements OnInit, OnDestroy {

  ecmspeInventories: CogInventory[]
  activeInventory: CogInventory;
  inventories: CogInventory[];
  cogName: string;
  sub1 = new Subscription();
  sub2 = new Subscription();

  constructor(private cogAssessService: CogAssessService) { }

  ngOnInit() {
    this.sub1 = this.cogAssessService.cogInventories$.subscribe((cogInventories: CogInventory[]) => {
      this.ecmspeInventories = cogInventories;
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
    this.inventories = this.ecmspeInventories;
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
