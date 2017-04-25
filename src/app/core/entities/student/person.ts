import { EntityBase } from '../EntityBase';
import { ProfileStudent } from './ProfileStudent';
import { RoadRunner } from './RoadRunner';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Person extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   bbUserName: string;
   lastName: string;
   firstName: string;
   avatarLocation: string;
   goByName: string;
   mpGender: string;
   mpAffiliation: string;
   mpPaygrade: string;
   mpComponent: string;
   email: string;
   registrationComplete: boolean;
   mpInstituteRole: string;
   roadRunnerAddresses: RoadRunner[];
   student: ProfileStudent;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

