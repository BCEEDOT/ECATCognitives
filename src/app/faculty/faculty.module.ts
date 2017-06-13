import { NgModule } from '@angular/core';

import { SharedModule } from "../shared/shared.module";
import { FacultyComponent } from './faculty.component';
import { WorkGroupsComponent } from './workgroups/work-groups.component';
import { FacultyRoutingModule } from "./faculty-routing.module";
import { FacultyAuthGuardService } from "./services/faculty-auth-guard.service";
import { EntityFacultyModule } from "../core/entities/faculty";
import { ListComponent } from './workgroups/list/list.component';
import { FacultyDataContextService } from "./services/faculty-data-context.service";

@NgModule({
  imports: [
    FacultyRoutingModule,
    EntityFacultyModule,
    SharedModule
  ],
  declarations: [
    FacultyComponent,
    WorkGroupsComponent,
    ListComponent,
  ], 
  providers: [
    FacultyAuthGuardService,
    FacultyDataContextService,
  ], 
  exports: [
  ]
})
export class FacultyModule { }
