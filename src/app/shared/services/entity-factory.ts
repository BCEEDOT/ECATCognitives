import { Injectable } from '@angular/core';
import { EntityManager, Entity, EntityQuery, FetchStrategy, SaveOptions, EntityChangedEventArgs } from 'breeze-client';
import { IEntityFactory } from './IEntity-factory';


@Injectable()
export class EntityFactory<T extends Entity> implements IEntityFactory<T> {

    constructor(private entityTypeName: string, private manager: EntityManager) {
    }

    create(config?: any): Promise<T> {
        let inst = <T>this.manager.createEntity(this.entityTypeName, config);
        // OLD version - did not allow config.
        // let inst = new this.type();
        // this.entityManagerProvider.manager().addEntity(inst);
        return Promise.resolve(inst);
    }
}