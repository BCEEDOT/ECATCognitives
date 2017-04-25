import { EntityBase } from '../EntityBase';
import { FacultyInCourse } from './FacultyInCourse';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { SpInventory } from './SpInventory';
import { WorkGroup } from './WorkGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacSpResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   assesseePersonId: number;
   courseId: number;
   workGroupId: number;
   inventoryItemId: number;
   facultyPersonId: number;
   mpItemResponse: string;
   itemModelScore: number;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   modifiedById: number;
   modifiedDate: Date;
   assessee: CrseStudentInGroup;
   facultyAssessor: FacultyInCourse;
   inventoryItem: SpInventory;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

