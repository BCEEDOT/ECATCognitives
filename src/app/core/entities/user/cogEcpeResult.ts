import { EntityBase } from '../entitybase';
import { CogInstrument } from './cogInstrument';
import { Person } from './person';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class CogEcpeResult extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   instrumentId: number;
   attempt: number;
   outcome: number;
   instrument: CogInstrument;
   person: Person;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

