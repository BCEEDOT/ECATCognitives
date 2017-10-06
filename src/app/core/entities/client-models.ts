import * as user from "./user";
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

export interface IFacultyApiResources extends IApiResources {
    initCourses: IApiResource;
    course: IApiResource;
    workGroup: IApiResource;
    instrument: IApiResource;
    wgComment: IApiResource;
    wgResult: IApiResource;
    currentWorkGroup: IApiResource;
}

export interface ILmsAdminApiResources extends IApiResources {
    allCourses: IApiResource;
    allGroups: IApiResource;
    courseModels: IApiResource;
    allCourseMembers: IApiResource;
    allGroupMembers: IApiResource;
    allGroupSetMembers: IApiResource;
    pollCourses: IApiResource;
    pollCourseMembers: IApiResource;
    pollGroups: IApiResource;
    pollAllGroupMembers: IApiResource;
    syncBbGrades: IApiResource;
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

//this is on the server... should really do this differently
export interface ISaveGradesResult extends EntityBase
{
    courseId: number;
    wgCategory: string;
    success: boolean;
    sentScores: number;
    returnedScores: number;
    numOfStudents: number;
    message: string;
}