import { Injectable } from '@angular/core';

import { BaseDataContext, IRepository } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import { Person } from '../../entities/user';
import { DataContext, UserResources } from '../../../app-constants';

@Injectable()
export class UserDataContext extends BaseDataContext {

    //person: IRepository<Person>;

    user: IDataContext;

    private userApiResources: IUserApiResources = {
        checkEmail: {
            returnedEntityType: _mp.MpEntityType.unk,
            resource: 'CheckUserEmail'
        },
        login: {
            returnedEntityType: _mp.MpEntityType.person,
            resource: 'Login'
        },
        profile: {
            returnedEntityType: _mp.MpEntityType.unk,
            resource:  'Profiles'
        },
        userToken: {
            resource: 'Token',
            returnedEntityType: _mp.MpEntityType.unk
        },
        cogInst: {
            resource: 'GetCogInst',
            returnedEntityType: _mp.MpEntityType.cogInstrument
        },
        cogResults: {
            resource: 'GetCogResults',
	    returnedEntityType: _mp.MpEntityType.unk
        },
        roadRunner: {
            resource: 'RoadRunnerInfos',
            returnedEntityType: _mp.MpEntityType.unk
        }

    };


    /**
     *
     */
    constructor(emProvider: EmProviderService) {
        super(DataContext.User); //This sets the current entitymanager to user
        //this.user = this.createRepository('user', userClientExtensions); //this returns the correct entityManager
        console.log(this.user);
        this.manager = emProviderSerive.getManager[user];
    }

    getProfile(){
        let query = EntityQuery.from(userApiResources.profile.resource);

        return <Promise<Profile>>this.em.executeQuery(query)
        .then(res => {
            return res.results[0] as profile
        })
        .catch(e => {
            console.log('Did not retrieve profile' + e);
            return Promise.reject(e);
        });

    }

}
