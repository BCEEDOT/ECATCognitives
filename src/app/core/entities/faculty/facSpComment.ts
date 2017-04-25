import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacultyInCourse } from './FacultyInCourse';
import { FacSpCommentFlag } from './FacSpCommentFlag';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { WorkGroup } from './WorkGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacSpComment extends EntityBase {
   // Generated code. Do not place code below this line.
   recipientPersonId: number;
   courseId: number;
   workGroupId: number;
   facultyPersonId: number;
   createdDate: Date;
   commentText: string;
   modifiedById: number;
   modifiedDate: Date;
   course: Course;
   facultyCourse: FacultyInCourse;
   flag: FacSpCommentFlag;
   recipient: CrseStudentInGroup;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

