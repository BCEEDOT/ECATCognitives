import { EntityBase } from '../EntityBase';
import { CogInstrument } from './CogInstrument';
import { CogResponse } from "./cogResponse";

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class CogInventory extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   instrumentId: number;
   displayOrder: number;
   isScored: boolean;
   isDisplayed: boolean;
   adaptiveDescription: string;
   innovativeDescription: string;
   itemType: string;
   itemDescription: string;
   isReversed: boolean;
   modifiedById: number;
   modifiedDate: Date;
   instrument: CogInstrument;

   /// <code> Place custom code between <code> tags
   response: CogResponse
   /// </code>

}

