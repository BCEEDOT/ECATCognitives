import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { CognitivesComponent } from "./cognitives.component";
import { CognitivesRoutingModule } from "./cognitives-routing.module";
import { ResultComponent } from './result/result.component';

import { EcpeResultComponent } from './result/ecpe-result/ecpe-result.component';
import { EcmspeResultComponent } from './result/ecmspe-result/ecmspe-result.component';
import { EsalbResultComponent } from './result/esalb-result/esalb-result.component';
import { EtmpreResultComponent } from './result/etmpre-result/etmpre-result.component';
import { EcpeAssessComponent } from './assess/ecpe-assess/ecpe-assess.component';
import { EcmspeAssessComponent } from './assess/ecmspe-assess/ecmspe-assess.component';
import { EsalbAssessComponent } from './assess/esalb-assess/esalb-assess.component';
import { EtmpreAssessComponent } from './assess/etmpre-assess/etmpre-assess.component';
import { AssessComponent } from './assess/assess.component';

import { CogResultsService } from "./services/cog-results.service";

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
        EcmspeAssessComponent,
        EsalbAssessComponent,
        EtmpreAssessComponent,
        AssessComponent
    ],
    exports: [],
    providers: [CogResultsService]
})

export class CognitivesModule { }