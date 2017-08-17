import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { isEmpty } from "lodash"

import { CogEcpeResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";

@Component({
    selector: 'ecpe-result',
    templateUrl: './ecpe-result.component.html',
    styleUrls: ['./ecpe-result.component.scss']
})
export class EcpeResultComponent implements OnInit {

    ecpeResult: CogEcpeResult;
    ecpeResultText: string;

    //TODO: Update eCPE mean and Standard Deviation values periodically based on new assessment data
    ecpeMean = 473;
    ecpeSD = 124;

    constructor(private cogResultsService: CogResultsService, private router: Router) { }

    ngOnInit() {
        this.cogResultsService.cogEcpeResult$.subscribe(res => {
            this.ecpeResult = res;
        });

        if (isEmpty(this.ecpeResult)) {
            this.router.navigate(['/cognitives']);
        }

        this.calcEcpeResult(this.ecpeResult);
    }

    private calcEcpeResult(ecpeResult: CogEcpeResult): void {
        if (this.ecpeResult.outcome < this.ecpeMean) {
            //Strongly Adaptive
            if (this.ecpeResult.outcome <= (this.ecpeMean - (this.ecpeSD * 2))) {
                this.ecpeResultText = "Strongly Adaptive";
                //Moderately Adaptive
            } else if (this.ecpeResult.outcome <= (this.ecpeMean - this.ecpeSD)) {
                this.ecpeResultText = "Moderately Adaptive";
                //Mildly Adaptive
            } else {
                this.ecpeResultText = "Mildly Adaptive";
            }
        } else if (this.ecpeResult.outcome > this.ecpeMean) {
            //Midly Innovative
            if (this.ecpeResult.outcome < (this.ecpeMean + this.ecpeSD)) {
                this.ecpeResultText = "Mildly Innovative";
                //Moderately Innovative
            } else if (this.ecpeResult.outcome < (this.ecpeMean + (this.ecpeSD * 2))) {
                this.ecpeResultText = "Moderately Innovative";
                //Strongly Innovative
            } else {
                this.ecpeResultText = "Strongly Innovative";
            }
        }
    }//end calcEcpeResult

}
