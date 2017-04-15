import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { CogEcmspeResult } from './cogEcmspeResult';
import { CogInstrument } from './cogInstrument';
import { CogInventory } from './cogInventory';
import { Person } from './person';
import { ProfileFaculty } from './profileFaculty';
import { RoadRunner } from './roadRunner';
import { Security } from './security';
import { ProfileStudent } from './profileStudent';
import { CogEcpeResult } from './cogEcpeResult';
import { CogEsalbResult } from './cogEsalbResult';
import { CogEtmpreResult } from './cogEtmpreResult';
import { CogResponse } from './cogResponse';

@Injectable()
export class CognitiveRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('CogEcmspeResult', CogEcmspeResult);
metadataStore.registerEntityTypeCtor('CogInstrument', CogInstrument);
metadataStore.registerEntityTypeCtor('CogInventory', CogInventory);
metadataStore.registerEntityTypeCtor('Person', Person);
metadataStore.registerEntityTypeCtor('ProfileFaculty', ProfileFaculty);
metadataStore.registerEntityTypeCtor('RoadRunner', RoadRunner);
metadataStore.registerEntityTypeCtor('Security', Security);
metadataStore.registerEntityTypeCtor('ProfileStudent', ProfileStudent);
metadataStore.registerEntityTypeCtor('CogEcpeResult', CogEcpeResult);
metadataStore.registerEntityTypeCtor('CogEsalbResult', CogEsalbResult);
metadataStore.registerEntityTypeCtor('CogEtmpreResult', CogEtmpreResult);
metadataStore.registerEntityTypeCtor('CogResponse', CogResponse);
        }
}
