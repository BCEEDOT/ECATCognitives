import { EntityBase } from '../EntityBase';
import { SpResultBreakOut } from './SpResultBreakOut';
import { Course } from './Course';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { WorkGroup } from './WorkGroup';
import { SpInstrument } from './SpInstrument';
import { SanitizedSpComment } from './SanitizedSpComment';
import { SanitizedSpResponse } from './SanitizedSpResponse';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SpResult extends EntityBase {
   // Generated code. Do not place code below this line.
   studentId: number;
   courseId: number;
   workGroupId: number;
   assignedInstrumentId: number;
   mpAssessResult: string;
   compositeScore: number;
   breakOut: SpResultBreakOut;
   assignedInstrument: SpInstrument;
   course: Course;
   resultFor: CrseStudentInGroup;
   sanitizedComments: SanitizedSpComment[];
   sanitizedResponses: SanitizedSpResponse[];
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

