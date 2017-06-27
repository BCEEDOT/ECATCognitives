import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CogInstrument } from "../../core/entities/user";

@Injectable()
export class CogAssessService {

  cogInstrument$: BehaviorSubject<CogInstrument> = new BehaviorSubject({} as CogInstrument);

  constructor() { }

  cogInstrument(cogInstrument: CogInstrument) {
    this.cogInstrument$.next(cogInstrument); 
  }  

}
