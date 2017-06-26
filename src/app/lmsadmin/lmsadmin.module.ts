import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { CoursesComponent } from './group-management/courses/courses.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupsComponent } from './group-management/groups/groups.component';
import { LmsAdminRoutingModule } from "./lmsadmin-routing.module";
import { SharedModule } from "../shared/shared.module";
import { EntityFacultyModule } from "../core/entities/faculty";
import { LmsadminAuthGuardService } from "./services/lmsadmin-auth-guard.service";
import { LmsadminDataContextService } from "./services/lmsadmin-data-context.service";
import { LmsadminComponent } from './lmsadmin.component';

@NgModule({
  imports: [
    LmsAdminRoutingModule,
    EntityFacultyModule,
    SharedModule,
  ],
  declarations: [
    LmsadminComponent,
    CoursesComponent, 
    GroupManagementComponent, 
    GroupsComponent, 
    
  ],
  providers: [
    LmsadminAuthGuardService,
    LmsadminDataContextService,
  ]
})
export class LmsadminModule { }
