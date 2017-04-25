import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacStratResponse } from './FacStratResponse';
import { StratResponse } from './StratResponse';
import { GroupMemReconResult } from './GroupMemReconResult';
import { SpResult } from './SpResult';
import { WorkGroup } from './WorkGroup';
import { StratResult } from './StratResult';
import { StudentInCourse } from './StudentInCourse';
import { ProfileStudent } from './ProfileStudent';

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
   assesseeStratResponse: StratResponse[];
   assessorStratResponse: StratResponse[];
   course: Course;
   facultyStrat: FacStratResponse;
   reconResult: GroupMemReconResult;
   spResult: SpResult;
   stratResult: StratResult;
   studentInCourse: StudentInCourse;
   studentProfile: ProfileStudent;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

