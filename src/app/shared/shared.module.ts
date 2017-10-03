import { LineChartModule } from '@swimlane/ngx-charts/release';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import {
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
    CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
    CovalentMenuModule, CovalentChipsModule, CovalentDataTableModule, CovalentMessageModule
} from '@covalent/core';
import {
    MdButtonModule, MdListModule, MdIconModule, MdCardModule, MdMenuModule, MdInputModule, MdButtonToggleModule,
    MdProgressSpinnerModule, MdSelectModule, MdSlideToggleModule, MdDialogModule, MdSnackBarModule, MdToolbarModule,
    MdTabsModule, MdSidenavModule, MdTooltipModule, MdCheckboxModule, MdRadioModule,
    MdProgressBarModule, MdSliderModule, MdChipsModule, MdRippleModule
} from '@angular/material';
import { BarChartModule, LineChartComponent, PieChartModule } from '@swimlane/ngx-charts';
import { DragulaModule } from "ng2-dragula";

import { LoggerService } from "./services/logger.service";
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
    imports: [
        //FlexLayoutModule,
        CommonModule,
        FormsModule,
        MdButtonModule,
        MdListModule,
        MdIconModule,
        MdCardModule,
        MdMenuModule,
        MdInputModule,
        MdButtonToggleModule,
        MdProgressSpinnerModule,
        MdSelectModule,
        MdSlideToggleModule,
        MdDialogModule,
        MdSnackBarModule,
        MdToolbarModule,
        MdTabsModule,
        MdSidenavModule,
        MdTooltipModule,
        MdCheckboxModule,
        MdRadioModule,
       // MdCoreModule,
        //MdAutocompleteModule,
        MdProgressBarModule,
        MdSliderModule,
        MdChipsModule,
        //MdGridListModule,
        MdRippleModule,
        CovalentCommonModule, 
        CovalentLayoutModule,
        CovalentMediaModule, 
        CovalentExpansionPanelModule, 
        CovalentMessageModule,
        //CovalentFileModule,
        //CovalentStepsModule, 
        CovalentLoadingModule, 
        CovalentDialogsModule, 
        CovalentSearchModule, 
        CovalentPagingModule,
        //CovalentNotificationsModule, 
        CovalentMenuModule, 
        CovalentChipsModule, 
        CovalentDataTableModule, 
        //CovalentJsonFormatterModule,
        //CovalentHighlightModule,
        //CovalentMarkdownModule,
        DragulaModule,
        //NgxChartsModule
        BarChartModule, LineChartModule, PieChartModule,

    ],
    declarations: [
    PagenotfoundComponent],
    exports: [
        FlexLayoutModule,
        CommonModule,
        FormsModule,
        MdButtonModule, 
        MdListModule, 
        MdIconModule, 
        MdCardModule, 
        MdMenuModule, 
        MdInputModule, 
        MdButtonToggleModule,
        MdProgressSpinnerModule, 
        MdSelectModule, 
        MdSlideToggleModule, 
        MdDialogModule, 
        MdSnackBarModule, 
        MdToolbarModule,
        MdTabsModule, 
        MdSidenavModule, 
        MdTooltipModule, 
        MdCheckboxModule, 
        MdRadioModule, 
        //MdCoreModule, 
        //MdAutocompleteModule,
        MdProgressBarModule, 
        MdSliderModule, 
        MdChipsModule, 
        //MdGridListModule, 
        MdRippleModule,
        CovalentCommonModule, 
        CovalentLayoutModule, 
        CovalentMediaModule, 
        CovalentExpansionPanelModule, 
        //CovalentFileModule,
        //CovalentStepsModule, 
        CovalentLoadingModule, 
        CovalentDialogsModule, 
        CovalentSearchModule, 
        CovalentPagingModule,
        //CovalentNotificationsModule, 
        CovalentMenuModule, 
        CovalentChipsModule, 
        CovalentDataTableModule, 
        //CovalentJsonFormatterModule,
        //CovalentHighlightModule, 
        CovalentMessageModule,
        //CovalentMarkdownModule,
        DragulaModule,
        BarChartModule, LineChartModule, PieChartModule,
    ],
    providers: [
        LoggerService
    ]
})

export class SharedModule { }