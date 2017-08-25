import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { isEmpty } from "lodash";
import { Subscription } from "rxjs/Subscription";

import { CogEcmspeResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";

@Component({
  selector: 'ecmspe-result',
  templateUrl: './ecmspe-result.component.html',
  styleUrls: ['./ecmspe-result.component.scss']
})
export class EcmspeResultComponent implements OnInit, OnDestroy {

  ecmspeResult: CogEcmspeResult;
  resSub: Subscription;

  constructor(private cogResultsService: CogResultsService, private router: Router) { };

  ngOnInit() {
    this.resSub = this.cogResultsService.cogEcmspeResult$.subscribe(res => {
      this.ecmspeResult = res;
    });

    if (isEmpty(this.ecmspeResult)) {
      this.router.navigate(['/cognitives']);
    }
  }

  ngOnDestroy(){
    this.resSub.unsubscribe();
  }
}
