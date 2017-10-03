import { EntityBase } from '../EntityBase';
import { ProfileFaculty } from './ProfileFaculty';
import { RoadRunner } from './RoadRunner';
import { Security } from './Security';
import { ProfileStudent } from './ProfileStudent';

/// <code-import> Place custom imports between <code-import> tags
import { EcLocalDataService } from "../../common/static"
/// </code-import>

export class Person extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   isActive: boolean;
   bbUserId: string;
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
   modifiedById: number;
   modifiedDate: Date;
   faculty: ProfileFaculty;
   roadRunnerAddresses: RoadRunner[];
   security: Security;
   student: ProfileStudent;

   /// <code> Place custom code between <code> tags
   //salutation: string;
   //prettyInstituteRole: string;

   constructor() {
       super();
       //this.salutation = EcLocalDataService.getSalutation(this.mpPaygrade, this.mpComponent, this.mpAffiliation);
       //this.prettyInstituteRole = EcLocalDataService.prettyInstituteRole(this.mpInstituteRole);
   }

   get salutation():string {
       return EcLocalDataService.getSalutation(this.mpPaygrade, this.mpComponent, this.mpAffiliation)
   }

   get prettyInstituteRole(): string {
       return EcLocalDataService.prettyInstituteRole(this.mpInstituteRole);
   }

   get prettyName(): string {
       return `${this.salutation} ${this.firstName} ${this.lastName}`
   }

     /// [Initializer]
    static initializer(entity: Person) { }
   /// </code>

}

