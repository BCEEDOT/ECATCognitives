import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileStudentComponent } from './student/profile-student.component';
import { FilterUnknownPipe } from "./pipes/filter-unknown.pipe";

@NgModule({
    imports: [
        ProfileRoutingModule,
        SharedModule
    ],
    declarations: [
        ProfileComponent,
        ProfileStudentComponent,
        FilterUnknownPipe
    ],
    exports: [],
    providers: []
})

export class ProfileModule { }