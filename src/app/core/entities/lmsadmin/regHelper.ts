import { MetadataStore } from 'breeze-client';
import { Injectable } from '@angular/core';
import { IRegistrationHelper } from '../IRegistrationHelper';
import { SpResultBreakOut } from './spResultBreakOut';
import { Course } from './course';
import { FacultyInCourse } from './facultyInCourse';
import { FacStratResponse } from './facStratResponse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { StratResponse } from './stratResponse';
import { GroupMemReconResult } from './groupMemReconResult';
import { SpResult } from './spResult';
import { SpInstrument } from './spInstrument';
import { WorkGroup } from './workGroup';
import { GroupReconResult } from './groupReconResult';
import { StratResult } from './stratResult';
import { WorkGroupModel } from './workGroupModel';
import { SpInventory } from './spInventory';
import { StudentInCourse } from './studentInCourse';
import { MemReconResult } from './memReconResult';
import { ProfileStudent } from './profileStudent';
import { Person } from './person';
import { ProfileFaculty } from './profileFaculty';
import { CourseReconResult } from './courseReconResult';

@Injectable()
export class LmsadminRegistrationHelper implements IRegistrationHelper {
    register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('SpResultBreakOut', SpResultBreakOut);
metadataStore.registerEntityTypeCtor('Course', Course);
metadataStore.registerEntityTypeCtor('FacultyInCourse', FacultyInCourse);
metadataStore.registerEntityTypeCtor('FacStratResponse', FacStratResponse);
metadataStore.registerEntityTypeCtor('CrseStudentInGroup', CrseStudentInGroup);
metadataStore.registerEntityTypeCtor('StratResponse', StratResponse);
metadataStore.registerEntityTypeCtor('GroupMemReconResult', GroupMemReconResult);
metadataStore.registerEntityTypeCtor('SpResult', SpResult);
metadataStore.registerEntityTypeCtor('SpInstrument', SpInstrument);
metadataStore.registerEntityTypeCtor('WorkGroup', WorkGroup);
metadataStore.registerEntityTypeCtor('GroupReconResult', GroupReconResult);
metadataStore.registerEntityTypeCtor('StratResult', StratResult);
metadataStore.registerEntityTypeCtor('WorkGroupModel', WorkGroupModel);
metadataStore.registerEntityTypeCtor('SpInventory', SpInventory);
metadataStore.registerEntityTypeCtor('StudentInCourse', StudentInCourse);
metadataStore.registerEntityTypeCtor('MemReconResult', MemReconResult);
metadataStore.registerEntityTypeCtor('ProfileStudent', ProfileStudent);
metadataStore.registerEntityTypeCtor('Person', Person);
metadataStore.registerEntityTypeCtor('ProfileFaculty', ProfileFaculty);
metadataStore.registerEntityTypeCtor('CourseReconResult', CourseReconResult);
        }
}
