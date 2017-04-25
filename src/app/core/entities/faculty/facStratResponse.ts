import { EntityBase } from '../EntityBase';
import { FacultyInCourse } from './FacultyInCourse';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { WorkGroup } from './WorkGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacStratResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   assesseePersonId: number;
   courseId: number;
   workGroupId: number;
   stratPosition: number;
   stratResultId: number;
   facultyPersonId: number;
   modifiedById: number;
   modifiedDate: Date;
   facultyAssessor: FacultyInCourse;
   studentAssessee: CrseStudentInGroup;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

