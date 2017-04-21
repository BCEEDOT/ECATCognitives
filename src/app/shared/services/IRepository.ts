import { Predicate } from 'breeze-client';

export interface IRepository<T> {
    withId(key: any): Promise<T>;
    where(predicate: Predicate): Promise<T[]>;
    whereInCache(predicate: Predicate): T[];
    all(): Promise<T[]>;
}