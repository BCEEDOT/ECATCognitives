import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { SpResultBreakOut } from './spResultBreakOut';
import { FacSpCommentFlag } from './facSpCommentFlag';
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
import { SanitizedSpComment } from './sanitizedSpComment';
import { SanitizedSpResponse } from './sanitizedSpResponse';
import { StratResult } from './stratResult';
import { StudentInCourse } from './studentInCourse';
import { ProfileStudent } from './profileStudent';
import { Person } from './person';
import { RoadRunner } from './roadRunner';

@Injectable()
export class StudentRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('SpResultBreakOut', SpResultBreakOut);
metadataStore.registerEntityTypeCtor('FacSpCommentFlag', FacSpCommentFlag);
metadataStore.registerEntityTypeCtor('Course', Course);
//metadataStore.setEntityTypeForResourceName('GetCourses', 'Course')
metadataStore.registerEntityTypeCtor('SpResponse', SpResponse);
metadataStore.registerEntityTypeCtor('CrseStudentInGroup', CrseStudentInGroup);
metadataStore.registerEntityTypeCtor('StratResponse', StratResponse);
metadataStore.registerEntityTypeCtor('StudSpComment', StudSpComment);
metadataStore.registerEntityTypeCtor('StudSpCommentFlag', StudSpCommentFlag);
metadataStore.registerEntityTypeCtor('WorkGroup', WorkGroup);
metadataStore.registerEntityTypeCtor('SpInstrument', SpInstrument);
metadataStore.registerEntityTypeCtor('SpInventory', SpInventory);
metadataStore.registerEntityTypeCtor('SpResult', SpResult);
metadataStore.registerEntityTypeCtor('SanitizedSpComment', SanitizedSpComment);
metadataStore.registerEntityTypeCtor('SanitizedSpResponse', SanitizedSpResponse);
metadataStore.registerEntityTypeCtor('StratResult', StratResult);
metadataStore.registerEntityTypeCtor('StudentInCourse', StudentInCourse);
metadataStore.registerEntityTypeCtor('ProfileStudent', ProfileStudent);
metadataStore.registerEntityTypeCtor('Person', Person);
metadataStore.registerEntityTypeCtor('RoadRunner', RoadRunner);
        }
}
