import { EntityBase } from '../EntityBase';
import { Person } from './Person';
import { FacultyInCourse } from './FacultyInCourse';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class ProfileFaculty extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   bio: string;
   homeStation: string;
   isCourseAdmin: boolean;
   isReportViewer: boolean;
   academyId: string;
   courses: FacultyInCourse[];
   person: Person;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

