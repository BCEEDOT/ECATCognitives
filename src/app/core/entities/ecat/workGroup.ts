import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { SpInstrument } from './SpInstrument';
import { WorkGroupModel } from './WorkGroupModel';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class WorkGroup extends EntityBase {
   // Generated code. Do not place code below this line.
   workGroupId: number;
   courseId: number;
   wgModelId: number;
   mpCategory: string;
   groupNumber: string;
   reconResultId: string;
   assignedSpInstrId: number;
   assignedKcInstrId: number;
   customName: string;
   bbGroupId: string;
   defaultName: string;
   mpSpStatus: string;
   isPrimary: boolean;
   modifiedById: number;
   modifiedDate: Date;
   assignedSpInstr: SpInstrument;
   course: Course;
   groupMembers: CrseStudentInGroup[];
   wgModel: WorkGroupModel;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

