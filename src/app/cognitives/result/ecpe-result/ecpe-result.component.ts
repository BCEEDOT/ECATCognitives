import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { isEmpty } from "lodash"

import { CogEcpeResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'ecpe-result',
    templateUrl: './ecpe-result.component.html',
    styleUrls: ['./ecpe-result.component.scss']
})
export class EcpeResultComponent implements OnInit, OnDestroy {

    ecpeResult: CogEcpeResult;
    resSub: Subscription;
    ecpeResultText: string;

    //TODO: Update eCPE mean and Standard Deviation values periodically based on new assessment data
    ecpeMean = 473;
    ecpeSD = 124;

    constructor(private cogResultsService: CogResultsService, private router: Router) { }

    ngOnInit() {
        this.resSub = this.cogResultsService.cogEcpeResult$.subscribe(res => {
            this.ecpeResult = res;
        });

        if (isEmpty(this.ecpeResult)) {
            this.router.navigate(['/cognitives']);
        }

        console.log(this.ecpeResult);
        this.calcEcpeResult(this.ecpeResult);
    }

    ngOnDestroy(){
        this.resSub.unsubscribe();
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
