import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { SpResponse } from './SpResponse';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { StratResponse } from './StratResponse';
import { StudSpComment } from './StudSpComment';
import { SpInstrument } from './SpInstrument';
import { SpResult } from './SpResult';
import { StratResult } from './StratResult';

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
   assignedSpInstr: SpInstrument;
   course: Course;
   groupMembers: CrseStudentInGroup[];
   spComments: StudSpComment[];
   spResponses: SpResponse[];
   spResults: SpResult[];
   spStratResponses: StratResponse[];
   spStratResults: StratResult[];

   /// <code> Place custom code between <code> tags
   displayName: string;
   /// </code>

}

