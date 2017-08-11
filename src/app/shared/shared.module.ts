import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import {
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule, CovalentFileModule,
    CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
    CovalentNotificationsModule, CovalentMenuModule, CovalentChipsModule, CovalentDataTableModule, CovalentJsonFormatterModule, CovalentMessageModule
} from '@covalent/core';
import {
    MdButtonModule, MdListModule, MdIconModule, MdCardModule, MdMenuModule, MdInputModule, MdButtonToggleModule,
    MdProgressSpinnerModule, MdSelectModule, MdSlideToggleModule, MdDialogModule, MdSnackBarModule, MdToolbarModule,
    MdTabsModule, MdSidenavModule, MdTooltipModule, MdCheckboxModule, MdRadioModule, MdCoreModule, MdAutocompleteModule,
    MdProgressBarModule, MdSliderModule, MdChipsModule, MdGridListModule, MdRippleModule
} from '@angular/material';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DragulaModule } from "ng2-dragula";

import { LoggerService } from "./services/logger.service";

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
        MdCoreModule,
        MdAutocompleteModule,
        MdProgressBarModule,
        MdSliderModule,
        MdChipsModule,
        MdGridListModule,
        MdRippleModule,
        CovalentCommonModule, 
        CovalentLayoutModule, 
        CovalentMediaModule, 
        CovalentExpansionPanelModule, 
        CovalentFileModule,
        CovalentStepsModule, 
        CovalentLoadingModule, 
        CovalentDialogsModule, 
        CovalentSearchModule, 
        CovalentPagingModule,
        CovalentNotificationsModule, 
        CovalentMenuModule, 
        CovalentChipsModule, 
        CovalentDataTableModule, 
        CovalentJsonFormatterModule,
        CovalentHighlightModule,
        CovalentMarkdownModule,
        DragulaModule,
        NgxChartsModule

    ],
    declarations: [
    ],
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
        MdCoreModule, 
        MdAutocompleteModule,
        MdProgressBarModule, 
        MdSliderModule, 
        MdChipsModule, 
        MdGridListModule, 
        MdRippleModule,
        CovalentCommonModule, 
        CovalentLayoutModule, 
        CovalentMediaModule, 
        CovalentExpansionPanelModule, 
        CovalentFileModule,
        CovalentStepsModule, 
        CovalentLoadingModule, 
        CovalentDialogsModule, 
        CovalentSearchModule, 
        CovalentPagingModule,
        CovalentNotificationsModule, 
        CovalentMenuModule, 
        CovalentChipsModule, 
        CovalentDataTableModule, 
        CovalentJsonFormatterModule,
        CovalentHighlightModule, 
        CovalentMessageModule,
        CovalentMarkdownModule,
        DragulaModule,
        NgxChartsModule,
    ],
    providers: [
        LoggerService
    ]
})

export class SharedModule { }