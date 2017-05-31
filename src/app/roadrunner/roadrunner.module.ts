import { NgModule } from "@angular/core";

//import { MaterialModule } from '@angular/material';
//import { DatepickerModule } from 'angular2-material-datepicker';

import { CovalentExpansionPanelModule } from '@covalent/core';
import { SharedModule } from "../shared/shared.module";
import { RoadrunnerComponent } from "./roadrunner.component";
import { RoadrunnerRoutingModule } from "./roadrunner-routing.module";
import {RoadrunnerService } from './services/roadrunner.service';
import { RoadrunnerDetailsComponent } from'./roadrunner-details/roadrunner-details.component';
//import { DatePickerModule } from 'angular-material-datepicker';
//import { DialogComponent } from "./roadrunner.dialog.component";
import {MaterialModule, MdNativeDateModule} from'@angular/material';
@NgModule({
    imports: [
        RoadrunnerRoutingModule,
        SharedModule,
        CovalentExpansionPanelModule,
        MdNativeDateModule,
        MaterialModule,
  //      MaterialModule.forRoot(),
  //      DatepickerModule,
  //      DatePickerModule,
        
    ],
    declarations: [
        RoadrunnerComponent,
 //       DialogComponent,
        RoadrunnerDetailsComponent,
        
    ],
    exports: [
        
    ],
    providers: [RoadrunnerService]
})

export class RoadrunnerModule { }