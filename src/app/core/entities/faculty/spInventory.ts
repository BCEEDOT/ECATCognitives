import { EntityBase } from '../EntityBase';
import { SpResponse } from './SpResponse';
import { SpInstrument } from './SpInstrument';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SpInventory extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   instrumentId: number;
   displayOrder: number;
   isDisplayed: boolean;
   behavior: string;
   modifiedById: number;
   modifiedDate: Date;
   instrument: SpInstrument;
   itemResponses: SpResponse[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

