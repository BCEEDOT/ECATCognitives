export class ResourceEndPoint {
    static User = 'user';
    static Student = 'student';
    static Faculty = 'faculty';
}

export enum DataContext {
    User,
    Student,
    Faculty
}

export class UserEntityType {
    static Person = 'Person';
}

export class UserResources {
    static getUsers = 'getUsers';
}

