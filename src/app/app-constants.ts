export class ResourceEndPoint {
    static User = 'user';
    static Student = 'student';
    static Faculty = 'faculty';
    static LmsAdmin = 'lmsadmin';
}

export enum DataContext {
    User,
    Student,
    Faculty,
    LmsAdmin
}

export class UserEntityType {
    static Person = 'Person';
}
