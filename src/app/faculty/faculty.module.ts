import { NgModule } from '@angular/core';

import { SharedModule } from "../shared/shared.module";
import { FacultyComponent } from './faculty.component';
import { WorkGroupsComponent } from './workgroups/work-groups.component';
import { FacultyRoutingModule } from "./faculty-routing.module";
import { FacultyAuthGuardService } from "./services/faculty-auth-guard.service";
import { EntityFacultyModule } from "../core/entities/faculty";
import { ListComponent } from './workgroups/list/list.component';
import { FacultyDataContextService } from "./services/faculty-data-context.service";
import { StatusComponent } from './workgroups/status/status.component';
import { EvaluateComponent } from './workgroups/evaluate/evaluate.component';
import { AssessComponent } from './workgroups/evaluate/assess/assess.component';
import { StratComponent } from './workgroups/evaluate/strat/strat.component';
import { CommentsComponent } from './workgroups/evaluate/comments/comments.component';
import { SpProviderModule } from "../provider/sp-provider/sp-provider.module";
import { FacWorkgroupService } from "./services/facworkgroup.service";
import { ResultsComponent } from './workgroups/results/results.component';
import { AssessOverviewComponent } from './workgroups/results/assess-overview/assess-overview.component';
import { StratOverviewComponent } from './workgroups/results/strat-overview/strat-overview.component';

@NgModule({
  imports: [
    SpProviderModule,
    FacultyRoutingModule,
    EntityFacultyModule,
    SharedModule
  ],
  declarations: [
    FacultyComponent,
    WorkGroupsComponent,
    ListComponent,
    StatusComponent,
    EvaluateComponent,
    AssessComponent,
    StratComponent,
    CommentsComponent,
    ResultsComponent,
    AssessOverviewComponent,
    StratOverviewComponent,
  ], 
  providers: [
    FacultyAuthGuardService,
    FacultyDataContextService,
    FacWorkgroupService
  ], 
  exports: [
  ]
})
export class FacultyModule { }
