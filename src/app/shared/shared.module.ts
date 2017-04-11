import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { CovalentCoreModule } from '@covalent/core';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';


import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
    imports: [
        CovalentCoreModule,    
        CovalentHighlightModule,
        CovalentMarkdownModule,
        NgxChartsModule,
        CommonModule
    ],
    declarations: [
    ],
    exports: [CovalentCoreModule, CovalentHighlightModule, CovalentMarkdownModule, FormsModule, CommonModule],
    providers: []
})

export class SharedModule { }