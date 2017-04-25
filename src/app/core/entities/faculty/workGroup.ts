import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacSpComment } from './FacSpComment';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { SpResponse } from './SpResponse';
import { SpInstrument } from './SpInstrument';
import { FacSpResponse } from './FacSpResponse';
import { FacStratResponse } from './FacStratResponse';
import { StudSpComment } from './StudSpComment';
import { SpResult } from './SpResult';
import { StratResponse } from './StratResponse';
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
   assignedSpInstrId: number;
   assignedKcInstrId: number;
   customName: string;
   defaultName: string;
   mpSpStatus: string;
   isPrimary: boolean;
   modifiedById: number;
   modifiedDate: Date;
   assignedSpInstr: SpInstrument;
   course: Course;
   facSpComments: FacSpComment[];
   facSpResponses: FacSpResponse[];
   facStratResponses: FacStratResponse[];
   groupMembers: CrseStudentInGroup[];
   spComments: StudSpComment[];
   spResponses: SpResponse[];
   spResults: SpResult[];
   spStratResponses: StratResponse[];
   spStratResults: StratResult[];
   wgModel: WorkGroupModel;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

