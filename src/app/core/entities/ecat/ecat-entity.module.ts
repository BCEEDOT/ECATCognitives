import { NgModule } from '@angular/core';
import { EcatRegistrationHelper } from './regHelper';
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

@NgModule({
  declarations: [],
  providers: [EcatRegistrationHelper]
})
export class EntityEcatModule { }
