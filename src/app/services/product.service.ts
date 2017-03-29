import { Injectable } from '@angular/core';
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp } from 'breeze-client';
import { EmProviderService } from './shared/em-provider.service';
import { Product } from '../../entities/product/product';
import { ModelsRegistrationHelper } from '../../entities/product/regHelper';


@Injectable()
export class ProductService  {

  private _em: EntityManager;
  private products: Product[] = [];

  constructor( private emProvider: EmProviderService, private regHelper: ModelsRegistrationHelper) {

    <any>this.emProvider.prepare('Product', this.regHelper)
            .then(() => this.getProducts())
            .catch(e => console.log("Did not get entity-manager " + e));
  }

  getProducts(): Promise<Product[]> {

      this._em = this.emProvider.newManager();
      let query = EntityQuery.from('getProducts');

      return <Promise<Product[]>> this._em.executeQuery(query)
      .then(res => this.products = res.results as Product[])
      .catch (e => {
          console.log("Did not retrieve products " + e);
          return Promise.reject(e);
      });
  }
}


