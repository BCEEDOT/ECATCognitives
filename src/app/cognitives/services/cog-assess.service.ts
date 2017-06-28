import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CogInstrument, CogInventory } from "../../core/entities/user";

@Injectable()
export class CogAssessService {

  cogInstrument$: BehaviorSubject<CogInstrument[]> = new BehaviorSubject({} as CogInstrument[]);
  cogActiveInventory$: BehaviorSubject<CogInventory> = new BehaviorSubject({} as CogInventory);

  constructor() { }

  cogInstrument(cogInstrument: CogInstrument[]) {
    this.cogInstrument$.next(cogInstrument);
  }

  cogActiveInventory(cogActiveInventory: CogInventory) {
    this.cogActiveInventory$.next(cogActiveInventory);
  }

  previousInventory() {
    let prev = this.cogInstrument$.value[0].inventoryCollection.find(inv => inv.displayOrder === (this.cogActiveInventory$.value.displayOrder - 1));
    this.cogActiveInventory(prev);
    //this.saveCheck();
  }

  nextInventory() {
    let next = this.cogInstrument$.value[0].inventoryCollection.find(inv => inv.displayOrder === (this.cogActiveInventory$.value.displayOrder + 1));
    this.cogActiveInventory(next);
    //this.saveCheck();
  }

}
