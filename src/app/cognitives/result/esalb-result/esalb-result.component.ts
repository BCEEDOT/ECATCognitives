import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as _ from "lodash";

import { CogEsalbResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";

@Component({
  selector: 'esalb-result',
  templateUrl: './esalb-result.component.html',
  styleUrls: ['./esalb-result.component.scss']
})
export class EsalbResultComponent implements OnInit {

  protected esalbResult: CogEsalbResult;

  constructor(private cogResultsService: CogResultsService, private router: Router) { }

  ngOnInit() {
    this.cogResultsService.cogEsalbResult$.subscribe(res => {
      this.esalbResult = res;
    });


    if (_.isEmpty(this.esalbResult)) {
        this.router.navigate(['/cognitives']);
    }
  }

}
