import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { Product } from './product';

@Injectable()
export class ModelsRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('Product', Product);
        }
}
