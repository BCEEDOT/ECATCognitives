import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { CogEcmspeResult } from './cogEcmspeResult';
import { CogInstrument } from './cogInstrument';
import { CogInventory } from './cogInventory';
import { Person } from './person';
import { ProfileFaculty } from './profileFaculty';
import { FacultyInCourse } from './facultyInCourse';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { StudentInCourse } from './studentInCourse';
import { ProfileStudent } from './profileStudent';
import { WorkGroup } from './workGroup';
import { SpInstrument } from './spInstrument';
import { SpInventory } from './spInventory';
import { WorkGroupModel } from './workGroupModel';
import { RoadRunner } from './roadRunner';
import { Security } from './security';
import { CogEcpeResult } from './cogEcpeResult';
import { CogEsalbResult } from './cogEsalbResult';
import { CogEtmpreResult } from './cogEtmpreResult';
import { CogResponse } from './cogResponse';

@Injectable()
export class EcatRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('CogEcmspeResult', CogEcmspeResult);
metadataStore.registerEntityTypeCtor('CogInstrument', CogInstrument);
metadataStore.registerEntityTypeCtor('CogInventory', CogInventory);
metadataStore.registerEntityTypeCtor('Person', Person);
metadataStore.registerEntityTypeCtor('ProfileFaculty', ProfileFaculty);
metadataStore.registerEntityTypeCtor('FacultyInCourse', FacultyInCourse);
metadataStore.registerEntityTypeCtor('Course', Course);
metadataStore.registerEntityTypeCtor('CrseStudentInGroup', CrseStudentInGroup);
metadataStore.registerEntityTypeCtor('StudentInCourse', StudentInCourse);
metadataStore.registerEntityTypeCtor('ProfileStudent', ProfileStudent);
metadataStore.registerEntityTypeCtor('WorkGroup', WorkGroup);
metadataStore.registerEntityTypeCtor('SpInstrument', SpInstrument);
metadataStore.registerEntityTypeCtor('SpInventory', SpInventory);
metadataStore.registerEntityTypeCtor('WorkGroupModel', WorkGroupModel);
metadataStore.registerEntityTypeCtor('RoadRunner', RoadRunner);
metadataStore.registerEntityTypeCtor('Security', Security);
metadataStore.registerEntityTypeCtor('CogEcpeResult', CogEcpeResult);
metadataStore.registerEntityTypeCtor('CogEsalbResult', CogEsalbResult);
metadataStore.registerEntityTypeCtor('CogEtmpreResult', CogEtmpreResult);
metadataStore.registerEntityTypeCtor('CogResponse', CogResponse);
        }
}
