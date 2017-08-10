import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as _ from "lodash";

import { CogEcmspeResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";

@Component({
  selector: 'ecmspe-result',
  templateUrl: './ecmspe-result.component.html',
  styleUrls: ['./ecmspe-result.component.scss']
})
export class EcmspeResultComponent implements OnInit {

  ecmspeResult: CogEcmspeResult;

  constructor(private cogResultsService: CogResultsService, private router: Router) { };

  ngOnInit() {
    this.cogResultsService.cogEcmspeResult$.subscribe(res => {
      this.ecmspeResult = res;
    });

    if (_.isEmpty(this.ecmspeResult)) {
      this.router.navigate(['/cognitives']);
    }
  }
}
