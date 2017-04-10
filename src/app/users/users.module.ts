import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersComponent } from "./users.component";
import { UsersFormComponent } from "./form/form.component";

import { UsersService} from "../../services/users.service";
import { SharedModule } from "../shared.module";

import { UsersRoutingModule } from "./users-routing.module";

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule
    ],
    declarations: [
        UsersComponent,
        UsersFormComponent
    ],
    exports: [],
    providers: [UsersService]
})

export class UsersModule { }