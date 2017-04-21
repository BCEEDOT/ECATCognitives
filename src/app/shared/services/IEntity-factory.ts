import { Entity} from 'breeze-client';

export interface IEntityFactory<T extends Entity> {
    create(...params: any[]): Promise<T>;
}