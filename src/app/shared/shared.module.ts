// import { LineChartModule } from '@swimlane/ngx-charts/release';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from "@angular/forms";
import {
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, 
    CovalentLoadingModule, CovalentDialogsModule,  
    CovalentMenuModule,
} from '@covalent/core';
import {
    MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatButtonToggleModule,
    MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
    MatSidenavModule, MatTooltipModule, MatGridListModule,
    MatProgressBarModule, MatSliderModule, MatChipsModule, MatRippleModule, 
} from '@angular/material';
// import { BarChartModule, LineChartComponent, PieChartModule } from '@swimlane/ngx-charts';
// import { DragulaModule } from "ng2-dragula";

import { RouterModule } from "@angular/router";
import { LoggerService } from "./services/logger.service";
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
    imports: [
        FlexLayoutModule,
        RouterModule,
        CommonModule,
        // FormsModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatInputModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatSnackBarModule,
        MatToolbarModule,
        
        MatSidenavModule,
        MatTooltipModule,
        MatGridListModule,
        
       // MatCoreModule,
        //MatAutocompleteModule,
        MatProgressBarModule,
        MatSliderModule,
        MatChipsModule,
        
        MatRippleModule,
        CovalentCommonModule, 
        CovalentLayoutModule,
        CovalentMediaModule, 
        // CovalentExpansionPanelModule, 
        
        //CovalentFileModule,
        //CovalentStepsModule, 
        CovalentLoadingModule, 
        CovalentDialogsModule, 
        // CovalentSearchModule, 
        // CovalentPagingModule,
        //CovalentNotificationsModule, 
        CovalentMenuModule, 
        // CovalentChipsModule, 
        // CovalentDataTableModule, 
        //CovalentJsonFormatterModule,
        //CovalentHighlightModule,
        //CovalentMarkdownModule,
        // DragulaModule,
        //NgxChartsModule
        // BarChartModule, LineChartModule, PieChartModule,

    ],
    declarations: [
    PagenotfoundComponent],
    exports: [
        FlexLayoutModule,
        RouterModule,
        CommonModule,
        // FormsModule,
        MatButtonModule, 
        MatListModule, 
        MatIconModule, 
        MatCardModule, 
        MatMenuModule, 
        MatInputModule, 
        MatButtonToggleModule,
        MatProgressSpinnerModule, 
        MatSelectModule, 
        MatSlideToggleModule, 
        MatDialogModule, 
        MatSnackBarModule, 
        MatToolbarModule,
         
        MatSidenavModule, 
        MatTooltipModule, 
        MatGridListModule,
         
        //MatCoreModule, 
        //MatAutocompleteModule,
        MatProgressBarModule, 
        MatSliderModule, 
        MatChipsModule, 
         
        MatRippleModule,
        CovalentCommonModule, 
        CovalentLayoutModule, 
        CovalentMediaModule, 
        // CovalentExpansionPanelModule, 
        //CovalentFileModule,
        //CovalentStepsModule, 
        CovalentLoadingModule, 
        CovalentDialogsModule, 
        // CovalentSearchModule, 
        // CovalentPagingModule,
        //CovalentNotificationsModule, 
        CovalentMenuModule, 
        // CovalentChipsModule, 
        // CovalentDataTableModule, 
        //CovalentJsonFormatterModule,
        //CovalentHighlightModule, 
        
        //CovalentMarkdownModule,
        // DragulaModule,
        // BarChartModule, LineChartModule, PieChartModule,
    ],
    providers: [
        LoggerService
    ]
})

export class SharedModule { }