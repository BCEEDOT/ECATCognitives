import { EntityBase } from '../entitybase';
import { CogInventory } from './cogInventory';
import { Person } from './person';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class CogResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   cogInventoryId: number;
   personId: number;
   attempt: number;
   itemScore: number;
   inventoryItem: CogInventory;
   person: Person;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

