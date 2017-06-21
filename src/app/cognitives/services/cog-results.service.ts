import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CogEcmspeResult, CogEcpeResult, CogEsalbResult, CogEtmpreResult } from "../../core/entities/user";

@Injectable()
export class CogResultsService {

  cogEcpeResult$: BehaviorSubject<CogEcpeResult> = new BehaviorSubject({} as CogEcpeResult);

  cogEsalbResult$: BehaviorSubject<CogEsalbResult> = new BehaviorSubject({} as CogEsalbResult);

  cogEcmspeResult$: BehaviorSubject<CogEcmspeResult> = new BehaviorSubject({} as CogEcmspeResult);

  cogEtmpreResult$: BehaviorSubject<CogEtmpreResult> = new BehaviorSubject({} as CogEtmpreResult);

  constructor() { }

  cogEcpeResult(cogEcpeResult: CogEcpeResult) {
    this.cogEcpeResult$.next(cogEcpeResult);
  }

  cogEsalbResult(cogEsalbResult: CogEsalbResult) {
    this.cogEsalbResult$.next(cogEsalbResult);
  }

  cogEcmspeResult(cogEcmspeResult: CogEcmspeResult) {
    this.cogEcmspeResult$.next(cogEcmspeResult);
  }
  
  cogEtmpreResult(cogEtmpreResult: CogEtmpreResult) {
    this.cogEtmpreResult$.next(cogEtmpreResult);
  }

} 
