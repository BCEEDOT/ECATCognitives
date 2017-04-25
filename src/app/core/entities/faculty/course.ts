import { EntityBase } from '../EntityBase';
import { FacultyInCourse } from './FacultyInCourse';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { SpResponse } from './SpResponse';
import { WorkGroup } from './WorkGroup';
import { SpResult } from './SpResult';
import { StratResult } from './StratResult';
import { StudentInCourse } from './StudentInCourse';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Course extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   academyId: string;
   name: string;
   classNumber: string;
   term: string;
   gradReportPublished: boolean;
   startDate: Date;
   gradDate: Date;
   faculty: FacultyInCourse[];
   spResponses: SpResponse[];
   spResults: SpResult[];
   stratResults: StratResult[];
   studentInCrseGroups: CrseStudentInGroup[];
   students: StudentInCourse[];
   workGroups: WorkGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

