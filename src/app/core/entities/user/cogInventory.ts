import { EntityBase } from '../entitybase';
import { CogInstrument } from './cogInstrument';
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
   response: CogResponse;
   isChanged: boolean = false;
   /// </code>
    rejectChanges(): void {
        this.response.entityAspect.rejectChanges();
        this.isChanged = false;
    }


}

