import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { ValueItem } from './valueItem';

@Injectable()
export class ModelsRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('ValueItem', ValueItem);
        }
}
