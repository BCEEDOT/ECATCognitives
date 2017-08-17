import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { isEmpty } from "lodash";

import { CogEtmpreResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";

@Component({
  selector: 'etmpre-result',
  templateUrl: './etmpre-result.component.html',
  styleUrls: ['./etmpre-result.component.scss']
})
export class EtmpreResultComponent implements OnInit {

  etmpreResult: CogEtmpreResult;

  constructor(private cogResultsService: CogResultsService, private router: Router) { };

  ngOnInit() {
    this.cogResultsService.cogEtmpreResult$.subscribe(res => {
      this.etmpreResult = res;
    });

    if (isEmpty(this.etmpreResult)) {
      this.router.navigate(['/cognitives']);
    }
  }

}
