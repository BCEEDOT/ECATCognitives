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
