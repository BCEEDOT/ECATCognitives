import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { ProfileFaculty } from './profileFaculty';
import { Person } from './person';
import { RoadRunner } from './roadRunner';
import { Security } from './security';
import { ProfileStudent } from './profileStudent';

@Injectable()
export class UserRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('ProfileFaculty', ProfileFaculty);
metadataStore.registerEntityTypeCtor('Person', Person);
metadataStore.registerEntityTypeCtor('RoadRunner', RoadRunner);
metadataStore.registerEntityTypeCtor('Security', Security);
metadataStore.registerEntityTypeCtor('ProfileStudent', ProfileStudent);
        }
}
