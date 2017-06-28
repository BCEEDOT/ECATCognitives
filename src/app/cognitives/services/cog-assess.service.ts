import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CogInstrument, CogInventory } from "../../core/entities/user";

@Injectable()
export class CogAssessService {

  cogInventories$: BehaviorSubject<CogInventory[]> = new BehaviorSubject({} as CogInventory[]);
  cogActiveInventory$: BehaviorSubject<CogInventory> = new BehaviorSubject({} as CogInventory);

  constructor() { }

  cogInventories(cogInventories: CogInventory[]) {
    this.cogInventories$.next(cogInventories);
  }

  cogActiveInventory(cogActiveInventory: CogInventory) {
    this.cogActiveInventory$.next(cogActiveInventory);
  }

  previousInventory() {
    let prev = this.cogInventories$.value.find(inv => inv.displayOrder === (this.cogActiveInventory$.value.displayOrder - 1));
    this.cogActiveInventory(prev);
    //this.saveCheck();
  }

  nextInventory() {
    let next = this.cogInventories$.value.find(inv => inv.displayOrder === (this.cogActiveInventory$.value.displayOrder + 1));
    this.cogActiveInventory(next);
    //this.saveCheck();
  }

}
