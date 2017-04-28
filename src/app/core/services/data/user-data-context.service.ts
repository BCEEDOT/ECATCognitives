import { Injectable } from '@angular/core';
import {
    EntityManager, NamingConvention, DataService, DataType, MetadataStore,
    EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises
} from 'breeze-client';

import { BaseDataContext } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import { Person, ProfileStudent, ProfileFaculty, CogInstrument, RoadRunner } from '../../entities/user';
import { IUserApiResources } from "../../entities/client-models";
import { MpEntityType } from "../../common/mapStrings";
import { DataContext } from '../../../app-constants';

@Injectable()
export class UserDataContext extends BaseDataContext {

    //person: IRepository<Person>;

    user: DataContext;

    private userApiResources: IUserApiResources = {
        checkEmail: {
            returnedEntityType: MpEntityType.unk,
            resource: 'CheckUserEmail'
        },
        profile: {
            returnedEntityType: MpEntityType.unk,
            resource: 'Profiles'
        },
        cogInst: {
            resource: 'GetCogInst',
            returnedEntityType: MpEntityType.cogInstrument
        },
        cogResults: {
            resource: 'GetCogResults',
            returnedEntityType: MpEntityType.unk
        },
        roadRunner: {
            resource: 'RoadRunnerInfos',
            returnedEntityType: MpEntityType.unk
        }

    };

    constructor(emProvider: EmProviderService) {
        super(DataContext.User, emProvider);
    }


    getProfile() {
        
    }

    getUsers(): Promise<Person[]> {

        let query = EntityQuery.from('getusers');

        return <Promise<Person[]>>this.manager.executeQuery(query)
            .then(res => {
                console.log(res.results);
                var store = this.manager.metadataStore;
                var personType = store.getEntityType('Person');
                personType.dataProperties.forEach((dp) => {
                console.log(dp.name);
                });

                console.log(store);
                console.log(personType);
                var person = res.results[0];
                person.entityAspect;
                person.entityType;
                return res.results as Person[]

            })
            .catch(e => {
                console.log('Did not retrieve users' + e);
                return Promise.reject(e);
            });
    }

    

}
