import { Injectable } from '@angular/core';
import {
  EntityManager, NamingConvention, DataService, DataType, MetadataStore,
  EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, ValidationOptionsConfiguration, ValidationOptions
} from 'breeze-client';
import { includes, remove } from "lodash";
import { AuthHttp } from 'angular2-jwt';
import { AjaxAngularAdapter } from "breeze-bridge-angular";

// Import required breeze adapters. Rollup.js requires the use of breeze.base.debug.js, which doesn't include
// the breeze adapters. 
import 'breeze-client/breeze.dataService.webApi';
import 'breeze-client/breeze.modelLibrary.backingStore';
import 'breeze-client/breeze.uriBuilder.json';
import 'breeze-client/breeze.uriBuilder.odata';

import { EntityTypeAnnotation } from './../entities/entity-type-annotation';
import { IRegistrationHelper } from './../entities/IRegistrationHelper';
import { Metadata } from "./../entities/user/metadata";
import { DEV_API } from './../../../config/api.config';
import { DataContext, ResourceEndPoint } from '../../app-constants';

export interface IManager {
  dataContext: DataContext;
  manager: EntityManager;
  promise: Promise<any>,
  [index: number]: IManager;
}


@Injectable()
export class EmProviderService {

  private static masterManagers: Array<IManager> = [];
  private static preparePromise: Promise<any>;

  constructor(private authHttp: AuthHttp) {

  }

  //Need to account for client entity extensions.
  prepare(dataContext: DataContext, regHelper: IRegistrationHelper, resourceEndPoint: ResourceEndPoint): Promise<boolean> {

    NamingConvention.camelCase.setAsDefault();
    // new ValidationOptions({ validateOnAttach: false }).setAsDefault();

    // configure breeze to use authHTTP instead of default angular http class. Used to add access token to header
    config.registerAdapter('ajax', () => new AjaxAngularAdapter(<any>this.authHttp));
    config.initializeAdapterInstance('ajax', AjaxAngularAdapter.adapterName, true);

    config.initializeAdapterInstances({ dataService: 'webApi', uriBuilder: 'json' });

    let emStatus = EmProviderService.masterManagers[dataContext];

    if (!emStatus) {
      emStatus = EmProviderService.masterManagers[dataContext] = {
        dataContext: dataContext,
        manager: null,
        promise: null,
      };
    }

    if (!emStatus.promise) {


      let serviceEndPoint = DEV_API + resourceEndPoint;

      console.log(serviceEndPoint);


      let dsconfig: DataServiceOptions = {
        serviceName: serviceEndPoint,
        hasServerMetadata: false
      };

      let dataService = new DataService(dsconfig);

      //  let validationConfig: ValidationOptionsConfiguration = {
      //   validateOnAttach: true
      // };

      // let validationOptions = new ValidationOptions(validationConfig);




      let currentManager = emStatus.manager = new
        EntityManager({
          dataService: dataService,
        });



      emStatus.manager.metadataStore.importMetadata(JSON.stringify(Metadata.value));
      regHelper.register(emStatus.manager.metadataStore);
      this.registerAnnotations(emStatus.manager.metadataStore);

      emStatus.promise = Promise.resolve(true);

      return emStatus.promise;

       //emStatus.manager.fetchMetadata()
      //   .then(() => {
      //     regHelper.register(emStatus.manager.metadataStore);
      //     this.registerAnnotations(emStatus.manager.metadataStore);
      //   })
      //   .catch(e => {
      //     //If there is an error reset
      //     emStatus.promise = null;
      //     console.log("Error retrieving metadata");
      //     console.log(`error from prepare em----- ${e}`)
      //     throw e;

      //   });
    }

    return emStatus.promise;
  }

  clear(ecatContext: DataContext): void {
    if (EmProviderService.masterManagers[ecatContext]) {
      EmProviderService.masterManagers[ecatContext].manager.clear();
    }
  }

  getManager(ecatContext: DataContext): EntityManager {
    return EmProviderService.masterManagers[ecatContext].manager;
  }

  //What does this do?
  private registerAnnotations(metadataStore: MetadataStore) {
    metadataStore.getEntityTypes().forEach((t: EntityType) => {
      let et = <EntityType>t;
      let ctor = <any>et.getCtor();
      if (ctor && ctor.getEntityTypeAnnotation) {
        let etAnnotation = <EntityTypeAnnotation>ctor.getEntityTypeAnnotation();
        et.validators.push(...etAnnotation.validators);
        etAnnotation.propertyAnnotations.forEach((pa) => {
          let prop = et.getProperty(pa.propertyName);
          prop.validators.push(...pa.validators);
          prop.displayName = pa.displayName;
        });
        this.ignoreForSerialization(metadataStore, t, ...etAnnotation.ignoreForSerialization);
      }
    });
  }

  //What does this do?
  private ignoreForSerialization(metadataStore: MetadataStore, typeInfo: string | EntityType, ...propertyNames: string[]) {
    if (!propertyNames || propertyNames.length == 0) return;

    let entityType = typeof (typeInfo) === 'string' ? <EntityType>metadataStore.getEntityType(<string>typeInfo) : <EntityType>typeInfo;

    // Recursivley walk the inheritance tree and ignore the same properties for all parent types
    let parentTypes = metadataStore.getEntityTypes().filter(type => {
      let parentType = <EntityType>type;
      return parentType.baseEntityType && parentType.baseEntityType === entityType;
    });
    parentTypes.forEach((parentType: EntityType) => this.ignoreForSerialization(metadataStore, parentType, ...propertyNames));

    // Now ignore for current type
    let dps = propertyNames.map(propertyName => {
      let dp = entityType.getDataProperty(propertyName);
      if (!dp) {
        console.warn(`No data property with name ${propertyName} found in entity type ${entityType.shortName}`);
      }
      return dp;
    });
    // Get all the nulls out
    remove(dps, dp => !dp);

    // Get existing ignored properties
    let ignoredProperties: DataProperty[] = (<any>entityType).$ignoredProperties;

    // Signals that we've already installed our custom serializerFn
    if (ignoredProperties) {
      remove(dps, dp => includes(ignoredProperties, dp))
      ignoredProperties = ignoredProperties.concat(dps);
    } else {
      // First ignored properties for this entity type
      ignoredProperties = dps;
      let origSerializerFn: (dataProperty: DataProperty, value: any) => any = (<any>entityType).serializerFn;
      entityType.setProperties({
        serializerFn: (dp, value) => {
          if (includes((<any>entityType).$ignoredProperties, dp)) {
            // Return undefined if property is ignored for serialization
            return undefined;
          }

          return origSerializerFn ? origSerializerFn(dp, value) : value;
        }
      });
    }
    (<any>entityType).$ignoredProperties = ignoredProperties;
  }

}
