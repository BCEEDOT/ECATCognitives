import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { SpResultBreakOut } from './spResultBreakOut';
import { Course } from './course';
import { FacultyInCourse } from './facultyInCourse';
import { FacSpComment } from './facSpComment';
import { FacSpCommentFlag } from './facSpCommentFlag';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { SpResponse } from './spResponse';
import { SpInventory } from './spInventory';
import { SpInstrument } from './spInstrument';
import { WorkGroup } from './workGroup';
import { FacSpResponse } from './facSpResponse';
import { FacStratResponse } from './facStratResponse';
import { StudSpComment } from './studSpComment';
import { StudSpCommentFlag } from './studSpCommentFlag';
import { SpResult } from './spResult';
import { StratResponse } from './stratResponse';
import { StratResult } from './stratResult';
import { WorkGroupModel } from './workGroupModel';
import { StudentInCourse } from './studentInCourse';
import { ProfileStudent } from './profileStudent';
import { Person } from './person';
import { ProfileFaculty } from './profileFaculty';
import { RoadRunner } from './roadRunner';

@Injectable()
export class FacultyRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('SpResultBreakOut', SpResultBreakOut);
metadataStore.registerEntityTypeCtor('Course', Course);
metadataStore.registerEntityTypeCtor('FacultyInCourse', FacultyInCourse);
metadataStore.registerEntityTypeCtor('FacSpComment', FacSpComment);
metadataStore.registerEntityTypeCtor('FacSpCommentFlag', FacSpCommentFlag);
metadataStore.registerEntityTypeCtor('CrseStudentInGroup', CrseStudentInGroup);
metadataStore.registerEntityTypeCtor('SpResponse', SpResponse);
metadataStore.registerEntityTypeCtor('SpInventory', SpInventory);
metadataStore.registerEntityTypeCtor('SpInstrument', SpInstrument);
metadataStore.registerEntityTypeCtor('WorkGroup', WorkGroup);
metadataStore.registerEntityTypeCtor('FacSpResponse', FacSpResponse);
metadataStore.registerEntityTypeCtor('FacStratResponse', FacStratResponse);
metadataStore.registerEntityTypeCtor('StudSpComment', StudSpComment);
metadataStore.registerEntityTypeCtor('StudSpCommentFlag', StudSpCommentFlag);
metadataStore.registerEntityTypeCtor('SpResult', SpResult);
metadataStore.registerEntityTypeCtor('StratResponse', StratResponse);
metadataStore.registerEntityTypeCtor('StratResult', StratResult);
metadataStore.registerEntityTypeCtor('WorkGroupModel', WorkGroupModel);
metadataStore.registerEntityTypeCtor('StudentInCourse', StudentInCourse);
metadataStore.registerEntityTypeCtor('ProfileStudent', ProfileStudent);
metadataStore.registerEntityTypeCtor('Person', Person);
metadataStore.registerEntityTypeCtor('ProfileFaculty', ProfileFaculty);
metadataStore.registerEntityTypeCtor('RoadRunner', RoadRunner);
        }
}
