import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmProviderService} from './shared/em-provider.service';
import { EntityModelsModule } from '../../entities/product';

@NgModule({
    imports: [
        CommonModule,
        EntityModelsModule
    ],
    declarations: [],
    exports: [],
    providers: [EmProviderService]
})
export class ServicesModule { }