import { Injectable } from '@angular/core';
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp } from 'breeze-client';
import { EmProviderService } from '../app/core/em-provider.service';
import { ValueItem } from '../entities/value/valueitem';
import { ModelsRegistrationHelper } from '../entities/value/regHelper';


@Injectable()
export class ValuesService {

  private _em: EntityManager;
  private valueItems: ValueItem[] = [];

  constructor(private emProvider: EmProviderService, private regHelper: ModelsRegistrationHelper) {
    <any>this.emProvider.prepare("values", this.regHelper)
      .then(() => this.getValues())
      .catch(error => console.log("Did not get entity-manager" + error));


  }

  getValues(): Promise<ValueItem[]> {
    this._em = this.emProvider.newManager();
    let query = EntityQuery.from('values');

    return <Promise<ValueItem[]>>this._em.executeQuery(query)
      .then(res => this.valueItems = res.results as ValueItem[])
      .catch(error => { 
        console.log("Did not retrieve values" + error)
        return Promise.reject(error);
  })
}

}
