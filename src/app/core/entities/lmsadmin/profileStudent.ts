import { EntityBase } from '../EntityBase';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { StudentInCourse } from './StudentInCourse';
import { Person } from './Person';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class ProfileStudent extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   bio: string;
   homeStation: string;
   contactNumber: string;
   commander: string;
   shirt: string;
   commanderEmail: string;
   shirtEmail: string;
   courseGroupMemberships: CrseStudentInGroup[];
   courses: StudentInCourse[];
   person: Person;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

