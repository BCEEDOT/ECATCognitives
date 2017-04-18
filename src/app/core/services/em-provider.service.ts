import { Injectable } from '@angular/core';
import {
  config, EntityManager, NamingConvention, DataService, DataType, MetadataStore,
  EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions
} from 'breeze-client';
import remove from 'lodash/remove';
import includes from 'lodash/includes';

// Import required breeze adapters. Rollup.js requires the use of breeze.base.debug.js, which doesn't include
// the breeze adapters. 
import 'breeze-client/breeze.dataService.webApi';
import 'breeze-client/breeze.modelLibrary.backingStore';
import 'breeze-client/breeze.uriBuilder.json';
import 'breeze-client/breeze.uriBuilder.odata';

import { EntityTypeAnnotation } from './../entities/entity-type-annotation';
import { UserRegistrationHelper } from './../entities/user';
import { DEV_API } from './../../../config/api.config';


@Injectable()
export class EmProviderService {

  private static _manager: EntityManager;
  private static _preparePromise: Promise<any>;

  constructor() { }

  prepare(serviceEndPoint: string, regHelper: UserRegistrationHelper): Promise<any> {
    
    //Pulled from Environments file
    serviceEndPoint = DEV_API + serviceEndPoint;

    if (!EmProviderService._preparePromise) {
    config.initializeAdapterInstances({ dataService: 'webApi', uriBuilder: 'odata' });
    NamingConvention.camelCase.setAsDefault();
    let dsconfig: DataServiceOptions = {
      serviceName: serviceEndPoint
    };

    let dataService = new DataService(dsconfig);

    let manager = EmProviderService._manager = new
      EntityManager({
        dataService: dataService
      });

    return EmProviderService._preparePromise =
      manager.fetchMetadata()
        .then(() => {
          regHelper.register(manager.metadataStore);
          this.registerAnnotations(manager.metadataStore);
        })
        .catch(e => {
          //If there is an error reset
          EmProviderService._preparePromise = null;
          console.log("Error retrieving metadata");
          throw e;

        });
    }
    return EmProviderService._preparePromise;
}

getManager(): EntityManager {
  let manager = EmProviderService._manager;
  return manager;
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
