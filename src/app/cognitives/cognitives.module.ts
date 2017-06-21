import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { CognitivesComponent } from "./cognitives.component";
import { CognitivesRoutingModule } from "./cognitives-routing.module";

import { ResultComponent } from './result/result.component';
import { EcpeResultComponent } from './result/ecpe-result/ecpe-result.component';
import { EcmspeResultComponent } from './result/ecmspe-result/ecmspe-result.component';
import { EsalbResultComponent } from './result/esalb-result/esalb-result.component';
import { EtmpreResultComponent } from './result/etmpre-result/etmpre-result.component';

import { AssessComponent } from './assess/assess.component';
import { EcpeAssessComponent } from './assess/ecpe-assess/ecpe-assess.component';

import { EtmpreAssessComponent } from './assess/etmpre-assess/etmpre-assess.component';


import { CogResultsService } from "./services/cog-results.service";
import { EsalbecmspeAssessComponent } from './assess/esalbecmspe-assess/esalbecmspe-assess.component';

@NgModule({
    imports: [
        CognitivesRoutingModule,
        SharedModule
    ],
    declarations: [
        CognitivesComponent,
        ResultComponent,
        EcpeResultComponent,
        EcmspeResultComponent,
        EsalbResultComponent,
        EtmpreResultComponent,
        EcpeAssessComponent,
        EtmpreAssessComponent,
        AssessComponent,
        EsalbecmspeAssessComponent
    ],
    exports: [],
    providers: [CogResultsService]
})

export class CognitivesModule { }