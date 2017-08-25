import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { isEmpty } from "lodash";
import { Subscription } from "rxjs/Subscription";

import { CogEtmpreResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";

@Component({
  selector: 'etmpre-result',
  templateUrl: './etmpre-result.component.html',
  styleUrls: ['./etmpre-result.component.scss']
})
export class EtmpreResultComponent implements OnInit, OnDestroy {

  etmpreResult: CogEtmpreResult;
  resSub: Subscription;

  constructor(private cogResultsService: CogResultsService, private router: Router) { };

  ngOnInit() {
    this.resSub = this.cogResultsService.cogEtmpreResult$.subscribe(res => {
      this.etmpreResult = res;
    });

    if (isEmpty(this.etmpreResult)) {
      this.router.navigate(['/cognitives']);
    }
  }

  ngOnDestroy(){
    this.resSub.unsubscribe();
  }

}
