import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CogEcmspeResult, CogEcpeResult, CogEsalbResult, CogEtmpreResult } from "../../core/entities/user";

@Injectable()
export class CogResultsService {

  cogEcpeResult$: BehaviorSubject<CogEcpeResult> = new BehaviorSubject({} as CogEcpeResult);

  constructor() { }

  cogEcpeResult(cogEcpeResult: CogEcpeResult) {
    this.cogEcpeResult$.next(cogEcpeResult);
  }


} 
