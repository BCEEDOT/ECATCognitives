import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { UsersComponent } from "./users.component";
import { UsersRoutingModule } from "./users-routing.module";

@NgModule({
    imports: [
        UsersRoutingModule,
        SharedModule
    ],
    declarations: [
        UsersComponent
    ],
    exports: [],
    providers: []
})

export class UsersModule { }