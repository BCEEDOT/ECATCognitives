import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacStratResponse } from './FacStratResponse';
import { MemReconResult } from './MemReconResult';
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
   reconResultId: string;
   course: Course;
   facStratResponse: FacStratResponse[];
   facultyProfile: ProfileFaculty;
   reconResult: MemReconResult;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

