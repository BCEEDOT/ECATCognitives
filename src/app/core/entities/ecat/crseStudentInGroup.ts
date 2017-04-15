import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { StudentInCourse } from './StudentInCourse';
import { ProfileStudent } from './ProfileStudent';
import { WorkGroup } from './WorkGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class CrseStudentInGroup extends EntityBase {
   // Generated code. Do not place code below this line.
   studentId: number;
   courseId: number;
   workGroupId: number;
   hasAcknowledged: boolean;
   bbCrseStudGroupId: string;
   reconResultId: string;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   modifiedById: number;
   modifiedDate: Date;
   course: Course;
   studentInCourse: StudentInCourse;
   studentProfile: ProfileStudent;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

