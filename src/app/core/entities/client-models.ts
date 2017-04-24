import { Entity, EntityAspect, EntityType } from 'breeze-client';

import { Person, ProfileStudent, ProfileFaculty } from "./user";

export interface IPerson extends Person {
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

export interface IApiResource {
        resource: string;
        returnedEntityType: string;
    }

export interface IApiResources {
        [name: string]: IApiResource;
    }

export interface IUserApiResources extends IApiResources {
        checkEmail: IApiResource;
        //login: IApiResource;
        profile: IApiResource;
        //userToken: IApiResource;
        cogInst: IApiResource;
        cogResults: IApiResource;
        roadRunner: IApiResource;
    }