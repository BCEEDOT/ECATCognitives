import { Injectable } from '@angular/core';
import {
    EntityManager, NamingConvention, DataService, DataType, MetadataStore,
    EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, QueryResult
} from 'breeze-client';

import { BaseDataContext } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import { Person, ProfileStudent, ProfileFaculty, CogInstrument, RoadRunner } from '../../entities/user';
import { IUserApiResources } from "../../entities/client-models";
import { MpEntityType, MpInstituteRole } from "../../common/mapStrings";
import { DataContext } from '../../../app-constants';
import { GlobalService } from "../global.service";



@Injectable()
export class UserDataContext extends BaseDataContext {

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

    constructor(private emProvider: EmProviderService, private global: GlobalService) {
        super(DataContext.User, emProvider);
    }


    getProfile(): Promise<ProfileStudent & ProfileFaculty> {
        const self = this;
        //add flag for when the profile is loaded


        let query = EntityQuery.from(this.userApiResources.profile.resource);

        return <Promise<any>>this.manager.executeQuery(query)
            .then(res => getUserProfileResponse(res))
            .catch(this.queryFailed);

        function getUserProfileResponse(userProfileResult: QueryResult) {
            const userProfiles = userProfileResult.results as Array<ProfileStudent | ProfileFaculty>
            const profile = { personId: self.global.persona.value.person.personId };
            const userRole = self.global.persona.value.person.mpInstituteRole;
            let profileEntity: ProfileStudent | ProfileFaculty;
            const roles = MpInstituteRole;

            switch (userRole) {
                case roles.student:
                    if (!self.global.persona.value.isStudent) {
                        profileEntity = self.manager.createEntity(MpEntityType.studProfile, profile) as ProfileStudent
                    }
                    break;
                case roles.faculty:
                    if (!self.global.persona.value.isFaculty) {
                        profileEntity = self.manager.createEntity(MpEntityType.facProfile, profile) as ProfileFaculty
                    }
                    break;
                default:
                    profileEntity = null;
            }

            if (profileEntity) {
                userProfiles.push(profileEntity);
            }

            return userProfiles;

        }

    }

    //TODO: Delete before going to production. Test method only
    getUsers(): Promise<Person[]> {

        let query = EntityQuery.from('getusers');

        return <Promise<Person[]>>this.manager.executeQuery(query)
            .then(res => {
                console.log('users is querying the server');
                return res.results as Person[]

            })
            .catch(e => {
                console.log('Did not retrieve users' + e);
                return Promise.reject(e);
            });
    }



    getRoadRunnerInfos(force?: boolean): Promise<RoadRunner[]> {

        const self = this;

        let query = EntityQuery.from(this.userApiResources.roadRunner.resource);

        return <Promise<RoadRunner[]>>this.manager.executeQuery(query)
            .then(res => res.results as RoadRunner[])
            .catch(e => {
                console.log('Did not retrieve users road runner info' + e);
                return Promise.reject(e);
            });
    }

    addRoadRunner(): RoadRunner {

        const newAddress = this.manager.createEntity(MpEntityType.roadRunner,{personId: this.global.persona.value.person.personId}) as RoadRunner;

        return newAddress;
    }


}
