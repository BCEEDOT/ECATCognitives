import { Entity, EntityAspect, EntityType } from 'breeze-client';

import { Person, ProfileStudent, ProfileFaculty } from "./user";

export interface IPerson extends Person, IPersonClientExtensions {
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

export interface IPersonClientExtensions {
    //verifyPassword: string;
    //defaultAvatarLocation: string;
    //prettyInstituteRole: string;
    //salutation: string;
}