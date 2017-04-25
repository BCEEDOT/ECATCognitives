import { EntityBase } from '../EntityBase';
import { CrseStudentInGroup } from './CrseStudentInGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class GroupMemReconResult extends EntityBase {
   // Generated code. Do not place code below this line.
   id: string;
   courseId: number;
   workGroupId: number;
   workGroupName: string;
   groupType: string;
   academyId: string;
   numAdded: number;
   numRemoved: number;
   groupMembers: CrseStudentInGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

