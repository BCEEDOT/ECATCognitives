import { Entity, EntityAspect, EntityType } from 'breeze-client';
import { Person, ProfileStudent, ProfileFaculty } from "./user";



export interface IdToken {

    email: string;
    lastName: string;
    firstName: string;
    mpGender: string;
    mpAffiliation: string;
    mpPaygrade: string;
    mpComponent: string;
    mpInstituteRole: string;

}

export interface IPerson extends Person, PersonClientExtensions {
    student: ProfileStudent;
    faculty: ProfileFaculty;
    //external: IExternal;
    //hqStaff: IStaff;
    profile: IProfile;
    //roadRunnerAddresses: IRoadRunner[];
}

export interface IProfile {
    person: IPerson;
}

export interface PersonClientExtensions {
    //verifyPassword: string;
    //defaultAvatarLocation: string;
    //prettyInstituteRole: string;
    //salutation: string;
}