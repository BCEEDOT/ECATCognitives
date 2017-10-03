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
import { MyhighlightDirective } from './directives/myhighlight.directive';
import { ResultsDetailsComponent } from './workgroups/results/results-details/results-details.component';
import { BehaviorsComponent } from './workgroups/results/results-details/behaviors/behaviors.component';
import { ResultsCommentsComponent } from './workgroups/results/results-details/comments/comments.component';
import { FacultySaveChangesGuard } from "./services/faculty-savechangesguard.service";
import { FlightRosterComponent } from './workgroups/flight-roster/flight-roster.component';
import { RoutebackComponent } from './workgroups/routeback/routeback.component';

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
    MyhighlightDirective,
    ResultsDetailsComponent,
    BehaviorsComponent,
    ResultsCommentsComponent,
    FlightRosterComponent,
    RoutebackComponent,
  ], 
  providers: [
    FacultyAuthGuardService,
    FacultySaveChangesGuard,
    FacultyDataContextService,
    FacWorkgroupService
  ], 
  exports: [
  ]
})
export class FacultyModule { }
