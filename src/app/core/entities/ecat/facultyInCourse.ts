import { EntityBase } from '../EntityBase';
import { ProfileFaculty } from './ProfileFaculty';
import { Course } from './Course';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacultyInCourse extends EntityBase {
   // Generated code. Do not place code below this line.
   facultyPersonId: number;
   courseId: number;
   bbCourseMemId: string;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   reconResultId: string;
   course: Course;
   facultyProfile: ProfileFaculty;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

