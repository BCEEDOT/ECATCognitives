import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileStudentComponent } from './student/profile-student.component';

@NgModule({
    imports: [
        ProfileRoutingModule,
        SharedModule
    ],
    declarations: [
        ProfileComponent,
        ProfileStudentComponent
    ],
    exports: [],
    providers: []
})

export class ProfileModule { }