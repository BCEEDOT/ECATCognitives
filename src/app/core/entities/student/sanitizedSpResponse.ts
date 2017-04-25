import { EntityBase } from '../EntityBase';
import { SpInventory } from './SpInventory';
import { SpResult } from './SpResult';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SanitizedSpResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   id: string;
   courseId: number;
   assesseeId: number;
   workGroupId: number;
   isSelfResponse: boolean;
   peerGenericName: string;
   mpItemResponse: string;
   itemModelScore: number;
   inventoryItemId: number;
   inventoryItem: SpInventory;
   result: SpResult;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

