import { NgModule } from "@angular/core";

import { SharedModule } from '../shared/shared.module';
import { AssessComponent } from './assess/assess.component';
import { EcpeAssessComponent } from './assess/ecpe-assess/ecpe-assess.component';
import { EtmpreAssessComponent } from './assess/etmpre-assess/etmpre-assess.component';
import { CognitivesRoutingModule } from './cognitives-routing.module';
import { CognitivesComponent } from './cognitives.component';
import { EcmspeResultComponent } from './result/ecmspe-result/ecmspe-result.component';
import { EcpeResultComponent } from './result/ecpe-result/ecpe-result.component';
import { EsalbResultComponent } from './result/esalb-result/esalb-result.component';
import { EtmpreResultComponent } from './result/etmpre-result/etmpre-result.component';
import { ResultComponent } from './result/result.component';
import { CogAssessService } from './services/cog-assess.service';
import { CogResultsService } from './services/cog-results.service';
import { EcmspeAssessComponent } from './assess/ecmspe-assess/ecmspe-assess.component';
import { EsalbAssessComponent } from './assess/esalb-assess/esalb-assess.component';

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
        EcmspeAssessComponent,
        EsalbAssessComponent
    ],
    exports: [],
    providers: [CogResultsService, CogAssessService]
})

export class CognitivesModule { }