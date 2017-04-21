import { Injectable } from '@angular/core';
import { EntityManager, Entity, EntityQuery, FetchStrategy, SaveOptions, EntityChangedEventArgs } from 'breeze-client';
import { Subject } from 'rxjs/Subject';


export interface IEntityFactory<T extends Entity> {
    create(...params: any[]): T;
}

@Injectable()
export class EntityFactory<T extends Entity> implements IEntityFactory<T> {

    constructor(private _type: { new (): T; }, private _manager: EntityManager) { }

    create(config?: any): T {
        let entityTypeName: string = (<any>this._type).name;
        let inst = <T>this._manager.createEntity(entityTypeName, config);
        // OLD version - did not allow config.
        // let inst = new this.type();
        // this.entityManagerProvider.manager().addEntity(inst);
        return inst;
    }
}

export class SavedOrRejectedArgs {
    entities: Entity[];
    rejected: boolean;
}

