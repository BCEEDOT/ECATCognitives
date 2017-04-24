import { Injectable } from '@angular/core';
import {
    EntityManager, NamingConvention, DataService, DataType, MetadataStore,
    EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises
} from 'breeze-client';

import { BaseDataContext } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import { Person, ProfileStudent, ProfileFaculty, CogInstrument } from '../../entities/user';
import { IApiResources, IProfile } from "../../entities/client-models";
import { MpEntityType } from "../../common/mapStrings";
import { DataContext, UserResources } from '../../../app-constants';

@Injectable()
export class UserDataContext extends BaseDataContext {

    //person: IRepository<Person>;

    user: DataContext;

    private userApiResources: IApiResources = {
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
            .then(res => res.results as Person[])
            .catch(e => {
                console.log('Did not retrieve users' + e);
                return Promise.reject(e);
            });
    }

}
