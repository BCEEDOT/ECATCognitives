import { EntityBase } from '../EntityBase';
import { FacultyInCourse } from './FacultyInCourse';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { SpResult } from './SpResult';
import { WorkGroup } from './WorkGroup';
import { StratResult } from './StratResult';
import { StudentInCourse } from './StudentInCourse';
import { CourseReconResult } from './CourseReconResult';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Course extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   academyId: string;
   bbCourseId: string;
   name: string;
   classNumber: string;
   term: string;
   gradReportPublished: boolean;
   startDate: Date;
   gradDate: Date;
   reconResultId: string;
   faculty: FacultyInCourse[];
   reconResult: CourseReconResult;
   spResults: SpResult[];
   stratResults: StratResult[];
   studentInCrseGroups: CrseStudentInGroup[];
   students: StudentInCourse[];
   workGroups: WorkGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

