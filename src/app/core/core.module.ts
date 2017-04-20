import {
    ModuleWithProviders, NgModule,
    Optional, SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmProviderService } from './services/em-provider.service';

import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { AuthUtilityService } from './services/auth-utility.service';
import { EntityUserModule } from "./entities/user/user-entity.module";
import { GlobalService } from "./services/global.service";

// ATTENTION: Never import this module into a lazy loaded module. Only import into app module.
@NgModule({
    imports: [
        CommonModule,
        EntityUserModule
    ],
    declarations: [],
    exports: [],
    providers: [
        EmProviderService,
        AuthGuard,
        AuthService,
        AuthUtilityService,
        GlobalService,
    ]
})

export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}