import { EntityBase } from '../EntityBase';
import { CrseStudentInGroup } from './CrseStudentInGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class StratResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   assessorPersonId: number;
   assesseePersonId: number;
   courseId: number;
   workGroupId: number;
   stratPosition: number;
   assessee: CrseStudentInGroup;
   assessor: CrseStudentInGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

