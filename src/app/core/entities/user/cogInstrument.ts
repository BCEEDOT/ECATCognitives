import { EntityBase } from '../entitybase';
import { CogInventory } from './cogInventory';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class CogInstrument extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   version: string;
   isActive: boolean;
   cogInstructions: string;
   mpCogInstrumentType: string;
   modifiedById: number;
   modifiedDate: Date;
   inventoryCollection: CogInventory[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

