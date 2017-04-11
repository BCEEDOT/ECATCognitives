import {
    ModuleWithProviders, NgModule,
    Optional, SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmProviderService } from "./em-provider.service";

// ATTENTION: Never import this module into a lazy loaded module. Only import into app module.
@NgModule({
    imports: [CommonModule],
    declarations: [],
    exports: [],
    providers: [EmProviderService]
})

export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}