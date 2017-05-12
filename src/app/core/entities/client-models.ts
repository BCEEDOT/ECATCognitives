import * as user from "./user";
import * as student from "./student";
import * as faculty from "./faculty";
import { EntityBase } from "./EntityBase";

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

export interface IStudentApiResources extends IApiResources {
    initCourses: IApiResource;
    course: IApiResource;
    workGroup: IApiResource;
    wgResult: IApiResource;
}

export interface IMilPayGrade {
    civ: { designator: string };
    fn: { designator: string };
    e1: IMilRank;
    e2: IMilRank;
    e3: IMilRank;
    e4: IMilRank;
    e5: IMilRank;
    e6: IMilRank;
    e7: IMilRank;
    e8: IMilRank;
    e9: IMilRank;

}

export interface IMilRank {
    designator: string,
    usaf: IMilServiceRank,
    usa: IMilServiceRank,
    usn: IMilServiceRank,
    usmc: IMilServiceRank,

}

export interface IMilServiceRank {
    rankShortName: string;
    rankLongName: string;
}

export interface IStudSpInventory extends EntityBase, student.SpInventory {
   id: number;
   instrumentId: number;
   displayOrder: number;
   isDisplayed: boolean;
   behavior: string;
   //instrument: SpInstrument;
   itemResponses: student.SpResponse[];
}

export interface IFacSpInventory extends EntityBase, faculty.SpInventory {
   id: number;
   instrumentId: number;
   displayOrder: number;
   isDisplayed: boolean;
   behavior: string;
   //instrument: SpInstrument;
   itemResponses: faculty.SpResponse[];
}