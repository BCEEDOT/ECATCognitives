import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacStratResponse } from './FacStratResponse';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { StratResponse } from './StratResponse';
import { SpResult } from './SpResult';
import { SpInstrument } from './SpInstrument';
import { GroupReconResult } from './GroupReconResult';
import { StratResult } from './StratResult';
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
   canPublish: boolean;
   modifiedById: number;
   modifiedDate: Date;
   assignedSpInstr: SpInstrument;
   course: Course;
   facStratResponses: FacStratResponse[];
   groupMembers: CrseStudentInGroup[];
   reconResult: GroupReconResult;
   spResults: SpResult[];
   spStratResponses: StratResponse[];
   spStratResults: StratResult[];
   wgModel: WorkGroupModel;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

