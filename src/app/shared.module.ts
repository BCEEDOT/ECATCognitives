import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovalentCoreModule } from '@covalent/core';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';
import { RequestInterceptor } from '../config/interceptors/request.interceptor';

import { NgxChartsModule } from '@swimlane/ngx-charts';

const httpInterceptorProviders: Type<any>[] = [
    RequestInterceptor,
];

@NgModule({
    imports: [
        BreezeBridgeAngularModule,
        CovalentCoreModule,
        CovalentHttpModule.forRoot({
            interceptors: [{
                interceptor: RequestInterceptor, paths: ['**'],
            }],
        }),
        CovalentHighlightModule,
        CovalentMarkdownModule,
        NgxChartsModule,
    ],
    declarations: [
    ],
    exports: [CovalentCoreModule, CovalentHighlightModule, CovalentHttpModule, CovalentMarkdownModule, BreezeBridgeAngularModule],
    providers: [httpInterceptorProviders]
})

export class SharedModule { }