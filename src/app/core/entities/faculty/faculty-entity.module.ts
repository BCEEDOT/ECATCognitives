import { NgModule } from '@angular/core';
import { FacultyRegistrationHelper } from './regHelper';
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

@NgModule({
  declarations: [],
  providers: [FacultyRegistrationHelper]
})
export class EntityFacultyModule { }
