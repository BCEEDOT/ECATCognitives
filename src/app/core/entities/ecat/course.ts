import { EntityBase } from '../EntityBase';
import { FacultyInCourse } from './FacultyInCourse';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { StudentInCourse } from './StudentInCourse';
import { WorkGroup } from './WorkGroup';

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
   studentInCrseGroups: CrseStudentInGroup[];
   students: StudentInCourse[];
   workGroups: WorkGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

