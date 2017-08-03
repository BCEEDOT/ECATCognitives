import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { QueryResult } from 'breeze-client';
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { CogEcmspeResult, CogEcpeResult, CogEsalbResult, CogEtmpreResult, CogInstrument } from "../core/entities/user";
import { GlobalService } from "../core/services/global.service";
import { UserDataContext } from "../core/services/data/user-data-context.service";
import { CogResultsService } from "./services/cog-results.service";
import * as _mp from "../core/common/mapStrings";

@Component({
    //Selector only needed if another template is going to refernece
    selector: 'qs-cognitives',
    templateUrl: './cognitives.component.html',
    styleUrls: ['./cognitives.component.scss']
    //Limits only to current view and not children
    //viewProviders: [ UsersService ],
})
export class CognitivesComponent implements OnInit {

    protected ecpeResult: CogEcpeResult;
    protected etmpreResult: CogEtmpreResult;
    protected esalbResult: CogEsalbResult;
    protected ecmspeResult: CogEcmspeResult;

    cogResults$: Observable<Array<any>>;
    cogResults: Array<any>;

    protected view = {
        list: CogViews.List,
        ecpe: CogViews.ECPE,
        etmpre: CogViews.ETMPRE,
        esalb: CogViews.ESALB,
        ecmspe: CogViews.ECMSPE
    }

    protected cogType = _mp.MpCogInstrumentType;

    constructor(private titleService: Title,
        private route: ActivatedRoute,
        private router: Router,
        private loadingService: TdLoadingService,
        private snackBarService: MdSnackBar,
        private userDataContext: UserDataContext,
        private global: GlobalService,
        private cogResultsService: CogResultsService) {

        this.cogResults$ = route.data.pluck('results');

    }

    ngOnInit(): void {
        // broadcast to all listener observables when loading the page
        this.titleService.setTitle('Cognitives Center');
        this.cogResults$.subscribe(results => {
            this.cogResults = results;
        })
        this.activate();
    }

    activate(force?: boolean): void {
        //maps to ng-template tag
        this.loadingService.register('cognitives.list');

        const that = this;

        if (this.cogResults.length !== null) {
            this.cogResults.forEach(res => {
                console.log(res.instrument.mpCogInstrumentType);
                if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.ecpe) {
                    that.cogResultsService.cogEcpeResult(res);
                    that.ecpeResult = res;
                }
                if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.etmpre) {
                    that.cogResultsService.cogEtmpreResult(res);
                    that.etmpreResult = res;
                }
                if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.esalb) {
                    that.cogResultsService.cogEsalbResult(res);
                    that.esalbResult = res;
                }
                if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.ecmspe) {
                    that.cogResultsService.cogEcmspeResult(res);
                    that.ecmspeResult = res;
                }
            });
        }
    }//end activate

}//end CognitivesComponent

const enum CogViews {
    List,
    ECPE,
    ETMPRE,
    ESALB,
    ECMSPE
}