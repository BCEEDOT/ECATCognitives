import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { MemReconResult } from './MemReconResult';
import { ProfileStudent } from './ProfileStudent';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class StudentInCourse extends EntityBase {
   // Generated code. Do not place code below this line.
   studentPersonId: number;
   courseId: number;
   bbCourseMemId: string;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   reconResultId: string;
   course: Course;
   reconResult: MemReconResult;
   student: ProfileStudent;
   workGroupEnrollments: CrseStudentInGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

