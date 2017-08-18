import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
//import { CommonModule } from '@angular/common';
import { CovalentPagingModule } from '@covalent/core';
import { CoursesComponent } from './courses/courses.component';
import { LmsAdminRoutingModule } from "./lmsadmin-routing.module";
import { SharedModule } from "../shared/shared.module";
import { EntityLmsadminModule } from "../core/entities/lmsadmin";
import { LmsadminAuthGuardService } from "./services/lmsadmin-auth-guard.service";
import { LmsadminDataContextService } from "./services/lmsadmin-data-context.service";
import { LmsadminComponent } from './lmsadmin.component';
import { GroupSetsComponent } from './group-sets/group-sets.component';
import { ManageGroupsetComponent } from './group-sets/manage-groupset/manage-groupset.component';
import { CourseEnrollComponent } from './courses/course-enroll/course-enroll.component';
import { ConfigGroupsetComponent } from './group-sets/config-groupset/config-groupset.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';
import { LmsadminWorkgroupService } from "./services/lmsadmin-workgroup.service";
import { MyHighlightDirective } from './directives/my-highlight.directive';
import { EditGroupDialogComponent } from './group-sets/manage-groupset/edit-group-dialog/edit-group-dialog.component';
import { AddGroupDialogComponent } from './group-sets/manage-groupset/add-group-dialog/add-group-dialog.component';
import { PollLmsDialog } from './group-sets/poll-lms-dialog/poll-lms-dialog.component';
import {MaterialModule, MdNativeDateModule } from "@angular/material";
import { PublishGroupsetComponent } from './group-sets/publish-groupset/publish-groupset.component';

@NgModule({
  imports: [
    LmsAdminRoutingModule,
    EntityLmsadminModule,
    SharedModule,
    CovalentPagingModule,
    ReactiveFormsModule,
    MaterialModule,
    MdNativeDateModule
  ],
  declarations: [
    LmsadminComponent,
    CoursesComponent,
    GroupSetsComponent,
    ManageGroupsetComponent,
    CourseEnrollComponent,
    ConfigGroupsetComponent,
    CourseInfoComponent, MyHighlightDirective, EditGroupDialogComponent, AddGroupDialogComponent, 
    PollLmsDialog, PublishGroupsetComponent
  ],
  providers: [
    LmsadminAuthGuardService,
    LmsadminDataContextService,
    LmsadminWorkgroupService
  ],
  entryComponents: [
    EditGroupDialogComponent,
    AddGroupDialogComponent,
    PollLmsDialog
  ]
})
export class LmsadminModule { }
