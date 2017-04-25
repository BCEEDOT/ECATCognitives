import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacSpComment } from './FacSpComment';
import { FacSpResponse } from './FacSpResponse';
import { FacStratResponse } from './FacStratResponse';
import { ProfileFaculty } from './ProfileFaculty';

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
   course: Course;
   facSpComments: FacSpComment[];
   facSpResponses: FacSpResponse[];
   facStratResponse: FacStratResponse[];
   facultyProfile: ProfileFaculty;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

