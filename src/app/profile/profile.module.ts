import { NgModule } from "@angular/core";

import { ProfileComponent } from "./profile.component";
import { ProfileService} from "./services/profile.service";
import { SharedModule } from "../shared/shared.module";
import { ProfileRoutingModule } from "./profile-routing.module";

@NgModule({
    imports: [
        ProfileRoutingModule,
        SharedModule
    ],
    declarations: [
        ProfileComponent
    ],
    exports: [],
    providers: [ProfileService]
})

export class ProfileModule { }