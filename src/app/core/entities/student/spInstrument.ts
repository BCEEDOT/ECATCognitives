import { EntityBase } from '../EntityBase';
import { WorkGroup } from './WorkGroup';
import { SpInventory } from './SpInventory';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SpInstrument extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   name: string;
   isActive: boolean;
   studentInstructions: string;
   assignedGroups: WorkGroup[];
   inventoryCollection: SpInventory[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

