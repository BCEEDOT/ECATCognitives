import { EntityBase } from '../entitybase';
import { Person } from './person';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Security extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   badPasswordCount: number;
   passwordHash: string;
   modifiedById: number;
   modifiedDate: Date;
   person: Person;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

