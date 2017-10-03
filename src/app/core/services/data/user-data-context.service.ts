import { Injectable } from '@angular/core';
import {
    EntityManager, NamingConvention, DataService, DataType, MetadataStore,
    EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, QueryResult
} from 'breeze-client';

import { BaseDataContext } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import { Person, ProfileStudent, ProfileFaculty, CogResponse, CogInstrument, RoadRunner, CogInventory,
         CogEcpeResult, CogEcmspeResult, CogEsalbResult, CogEtmpreResult } from '../../entities/user';
import { IUserApiResources } from "../../entities/client-models";
import { MpEntityType, MpInstituteRole, MpCogInstrumentType } from "../../common/mapStrings";
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
        },        
         getNewCogResult: {
            resource: 'GetNewCogResult',
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

    getCogResults(all: boolean, force?: boolean): Promise<Array<any>> {

        let query = EntityQuery.from(this.userApiResources.cogResults.resource).withParameters({ force: force, all: all });

        return <Promise<Array<any>>>this.manager.executeQuery(query)
            .then(res => {
                console.log('getCogResults is querying the server');
                return res.results;
            })
            .catch(e => {
                console.log('Did not retrieve CogRespones' + e);
                return Promise.reject(e);
            });
    }

    getCogInst(cogId: number): Promise<Array<CogInventory> | Promise<void>> {
        let that = this;
        let cogType = '';

        switch (cogId) {
            case 1:
                cogType = MpCogInstrumentType.ecpe
                break;
            case 2:
                cogType = MpCogInstrumentType.esalb
                break;
            case 3:
                cogType = MpCogInstrumentType.ecmspe
                break;
            case 4:
                cogType = MpCogInstrumentType.etmpre
                break;
        }


        let query = EntityQuery.from(this.userApiResources.cogInst.resource).withParameters({ type: cogType });

        return <Promise<Array<CogInventory>>>this.manager.executeQuery(query)
            .then(getCogInstResponse)
            .catch(this.queryFailed);

        function getCogInstResponse(result: QueryResult): Array<CogInventory> {
            const cogInst = result.results[0] as CogInstrument;
            if (!cogInst) {
                return null;
            }

            console.log('Retrieved cognitive instrument from remote cache', cogInst, false);
            const inventoryList = cogInst.inventoryCollection as Array<CogInventory>;
            const personId = that.global.persona.value.person.personId;

            let cogRespones = that.manager.getEntities(MpEntityType.cogResponse) as Array<CogResponse>;
            cogRespones.forEach(element => {
               that.manager.detachEntity(element);    
            });

            return inventoryList.map((item: CogInventory) => {
                const key = { personId: personId, cogInventoryId: item.id, attempt: (1) };

                let cogResponse = that.manager.createEntity(MpEntityType.cogResponse, key) as CogResponse;
                item.response = cogResponse;

                return item;
            }) as Array<CogInventory>;
        }
    }

    getNewCogResult(type: string, instId: number, prevAttempt: number): any {
        const personId = this.global.persona.value.person.personId;
        const key = { personId: personId, instrumentId: instId, attempt: (prevAttempt + 1) };

        switch (type) {
            case MpCogInstrumentType.ecpe:
                return this.manager.createEntity(MpEntityType.cogEcpeResult, key) as CogEcpeResult;
            case MpCogInstrumentType.etmpre:
                return this.manager.createEntity(MpEntityType.cogEtmpreResult, key) as CogEtmpreResult;
            case MpCogInstrumentType.esalb:
                return this.manager.createEntity(MpEntityType.cogEsalbResult, key) as CogEsalbResult;
            case MpCogInstrumentType.ecmspe:
                return this.manager.createEntity(MpEntityType.cogEcmspeResult, key) as CogEcmspeResult;
        }
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
