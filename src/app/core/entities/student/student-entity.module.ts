import { NgModule } from '@angular/core';
import { StudentRegistrationHelper } from './regHelper';
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

@NgModule({
  declarations: [],
  providers: [StudentRegistrationHelper]
})
export class EntityStudentModule { }
