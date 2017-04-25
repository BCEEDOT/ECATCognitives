import { EntityBase } from '../EntityBase';
import { Person } from './Person';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class RoadRunner extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   location: string;
   phoneNumber: string;
   leaveDate: Date;
   returnDate: Date;
   signOut: boolean;
   prevSignOut: boolean;
   personId: number;
   person: Person;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

