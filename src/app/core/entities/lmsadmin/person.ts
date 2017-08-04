import { EntityBase } from '../EntityBase';
import { ProfileStudent } from './ProfileStudent';
import { ProfileFaculty } from './ProfileFaculty';

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
   student: ProfileStudent;

   /// <code> Place custom code between <code> tags
   get rankName(): string {
        let _salutation: string;
        const p = (this.student) ? this.student.person : null;
        if (p && !_salutation) _salutation = EcLocalDataService.getSalutation(p.mpPaygrade, p.mpComponent, p.mpAffiliation);

        return (!p) ? 'Unk' : `${_salutation} ${this.student.person.lastName}, ${this.student.person.firstName}`;
    }
   /// </code>

}

