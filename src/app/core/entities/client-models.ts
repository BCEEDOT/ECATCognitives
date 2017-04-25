import * as user from "./user";
import * as student from "./student";
import * as faculty from "./faculty";


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

