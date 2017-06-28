import { NgModule } from "@angular/core";

import { CovalentExpansionPanelModule, CovalentMessageModule } from '@covalent/core';
import { SharedModule } from "../shared/shared.module";
import { RoadrunnerComponent } from "./roadrunner.component";
import { RoadrunnerRoutingModule } from "./roadrunner-routing.module";
import {RoadrunnerService } from './services/roadrunner.service';
import { RoadrunnerDetailsComponent } from'./roadrunner-details/roadrunner-details.component';

import {MaterialModule, MdNativeDateModule} from'@angular/material';

import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import { RoadrunnerCompletedComponent } from './roadrunner-completed/roadrunner-completed.component';
import { RoadrunnerLocationsComponent } from './roadrunner-locations/roadrunner-locations.component'

@NgModule({
    imports: [
        RoadrunnerRoutingModule,
        SharedModule,
        CovalentExpansionPanelModule,
        MdNativeDateModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        CovalentMessageModule,
        
    ],
    declarations: [
        RoadrunnerComponent,
        RoadrunnerDetailsComponent,
        RoadrunnerCompletedComponent,
        RoadrunnerLocationsComponent,
        
    ],
    exports: [
        
    ],
    providers: [RoadrunnerService]
})

export class RoadrunnerModule { }