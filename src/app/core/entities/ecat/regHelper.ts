import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { SpResultBreakOut } from './spResultBreakOut';
import { CogEcmspeResult } from './cogEcmspeResult';
import { CogInstrument } from './cogInstrument';
import { CogInventory } from './cogInventory';
import { Person } from './person';
import { ProfileFaculty } from './profileFaculty';
import { FacultyInCourse } from './facultyInCourse';
import { Course } from './course';
import { SpResponse } from './spResponse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { StratResponse } from './stratResponse';
import { StudSpComment } from './studSpComment';
import { StudSpCommentFlag } from './studSpCommentFlag';
import { WorkGroup } from './workGroup';
import { SpInstrument } from './spInstrument';
import { SpInventory } from './spInventory';
import { SpResult } from './spResult';
import { StratResult } from './stratResult';
import { WorkGroupModel } from './workGroupModel';
import { StudentInCourse } from './studentInCourse';
import { ProfileStudent } from './profileStudent';
import { RoadRunner } from './roadRunner';
import { Security } from './security';
import { CogEcpeResult } from './cogEcpeResult';
import { CogEsalbResult } from './cogEsalbResult';
import { CogEtmpreResult } from './cogEtmpreResult';
import { CogResponse } from './cogResponse';

@Injectable()
export class EcatRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('SpResultBreakOut', SpResultBreakOut);
metadataStore.registerEntityTypeCtor('CogEcmspeResult', CogEcmspeResult);
metadataStore.registerEntityTypeCtor('CogInstrument', CogInstrument);
metadataStore.registerEntityTypeCtor('CogInventory', CogInventory);
metadataStore.registerEntityTypeCtor('Person', Person);
metadataStore.registerEntityTypeCtor('ProfileFaculty', ProfileFaculty);
metadataStore.registerEntityTypeCtor('FacultyInCourse', FacultyInCourse);
metadataStore.registerEntityTypeCtor('Course', Course);
metadataStore.registerEntityTypeCtor('SpResponse', SpResponse);
metadataStore.registerEntityTypeCtor('CrseStudentInGroup', CrseStudentInGroup);
metadataStore.registerEntityTypeCtor('StratResponse', StratResponse);
metadataStore.registerEntityTypeCtor('StudSpComment', StudSpComment);
metadataStore.registerEntityTypeCtor('StudSpCommentFlag', StudSpCommentFlag);
metadataStore.registerEntityTypeCtor('WorkGroup', WorkGroup);
metadataStore.registerEntityTypeCtor('SpInstrument', SpInstrument);
metadataStore.registerEntityTypeCtor('SpInventory', SpInventory);
metadataStore.registerEntityTypeCtor('SpResult', SpResult);
metadataStore.registerEntityTypeCtor('StratResult', StratResult);
metadataStore.registerEntityTypeCtor('WorkGroupModel', WorkGroupModel);
metadataStore.registerEntityTypeCtor('StudentInCourse', StudentInCourse);
metadataStore.registerEntityTypeCtor('ProfileStudent', ProfileStudent);
metadataStore.registerEntityTypeCtor('RoadRunner', RoadRunner);
metadataStore.registerEntityTypeCtor('Security', Security);
metadataStore.registerEntityTypeCtor('CogEcpeResult', CogEcpeResult);
metadataStore.registerEntityTypeCtor('CogEsalbResult', CogEsalbResult);
metadataStore.registerEntityTypeCtor('CogEtmpreResult', CogEtmpreResult);
metadataStore.registerEntityTypeCtor('CogResponse', CogResponse);
        }
}
