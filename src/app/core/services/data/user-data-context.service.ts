import { Injectable } from '@angular/core';
import {
    config,
    DataProperty,
    DataService,
    DataServiceOptions,
    DataType,
    EntityManager,
    EntityQuery,
    EntityType,
    MergeStrategy,
    MetadataStore,
    NamingConvention,
    NavigationProperty,
    promises,
    QueryResult,
} from 'breeze-client';

import { BaseDataContext } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import {
    Person, ProfileStudent, ProfileFaculty, CogResponse, CogInstrument, RoadRunner, CogInventory,
    CogEcpeResult, CogEcmspeResult, CogEsalbResult, CogEtmpreResult
} from '../../entities/user';
import { IUserApiResources } from "../../entities/client-models";
import { MpEntityType, MpInstituteRole, MpCogInstrumentType } from "../../common/mapStrings";
import { DataContext } from '../../../app-constants';
import { GlobalService } from "../global.service";
import { staticCog } from "../../common/staticCog";


@Injectable()
export class UserDataContext extends BaseDataContext {

    user: DataContext;

    constructor(private emProvider: EmProviderService, private global: GlobalService) {
        super(DataContext.User, emProvider);
    }


    getCogResults(all: boolean, force?: boolean): any[] {

        return [];

    }

    getCogInst(cogId: number): CogInventory[] {
        let that: this = this;
        let cogInst;

        switch (cogId) {
            case 1:
                that.manager.importEntities(staticCog.cogEcpeInstrument);
                that.manager.importEntities(staticCog.cogEcpeInventory);
                cogInst = that.manager.getEntityByKey(MpEntityType.cogInstrument, 1);
                break;
            case 2:
                that.manager.importEntities(staticCog.cogEsalbInstrument);
                that.manager.importEntities(staticCog.cogEsalbInventory);
                cogInst = that.manager.getEntityByKey(MpEntityType.cogInstrument, 3);
                break;
            case 3:
                that.manager.importEntities(staticCog.cogEcmspeInstrument);
                that.manager.importEntities(staticCog.cogEcmspeInventory);
                cogInst = that.manager.getEntityByKey(MpEntityType.cogInstrument, 2);

                break;
            case 4:
                that.manager.importEntities(staticCog.cogEtmpreInstrument);
                that.manager.importEntities(staticCog.cogEtmpreInventory);
                cogInst = that.manager.getEntityByKey(MpEntityType.cogInstrument, 4);
                break;
            default:
                cogInst = undefined;
        }

        const inventoryList: CogInventory[] = cogInst.inventoryCollection as CogInventory[];
        const personId: number = 1;

        let cogResponses: CogResponse[] = that.manager.getEntities(MpEntityType.cogResponse) as CogResponse[];

        cogResponses.forEach(element => {
            that.manager.detachEntity(element);
        });

        return inventoryList.map((item: CogInventory) => {
            const key = { personId: personId, cogInventoryId: item.id, attempt: (1) };

            let cogResponse = that.manager.createEntity(MpEntityType.cogResponse, key) as CogResponse;
            item.response = cogResponse;

            return item;
        }) as Array<CogInventory>;



        // let query = EntityQuery.from(this.userApiResources.cogInst.resource).withParameters({ type: cogType });

        // return <Promise<Array<CogInventory>>>this.manager.executeQuery(query)
        //     .then(getCogInstResponse)
        //     .catch(this.queryFailed);

        // function getCogInstResponse(result: QueryResult): Array<CogInventory> {
        //     const cogInst = result.results[0] as CogInstrument;
        //     if (!cogInst) {
        //         return null;
        //     }

        //     console.log('Retrieved cognitive instrument from remote cache', cogInst, false);
        //     const inventoryList = cogInst.inventoryCollection as Array<CogInventory>;
        //     const personId = that.global.persona.value.person.personId;

        //     let cogRespones = that.manager.getEntities(MpEntityType.cogResponse) as Array<CogResponse>;
        //     cogRespones.forEach(element => {
        //         that.manager.detachEntity(element);
        //     });

        //     return inventoryList.map((item: CogInventory) => {
        //         const key = { personId: personId, cogInventoryId: item.id, attempt: (1) };

        //         let cogResponse = that.manager.createEntity(MpEntityType.cogResponse, key) as CogResponse;
        //         item.response = cogResponse;

        //         return item;
        //     }) as Array<CogInventory>;
        // }
    }

    getNewCogResult(type: string, instId: number, prevAttempt: number): any {

        const personId = 1;
        const key = { personId: personId, instrumentId: instId, attempt: (prevAttempt + 1) };
    
        switch (type) {
            case MpCogInstrumentType.ecpe:
                let entity = this.manager.getEntityByKey(MpEntityType.cogEcpeResult, key);

                console.log(entity);

                return this.manager.createEntity(MpEntityType.cogEcpeResult, key) as CogEcpeResult;
            case MpCogInstrumentType.etmpre:
                return this.manager.createEntity(MpEntityType.cogEtmpreResult, key) as CogEtmpreResult;
            case MpCogInstrumentType.esalb:
                return this.manager.createEntity(MpEntityType.cogEsalbResult, key) as CogEsalbResult;
            case MpCogInstrumentType.ecmspe:
                return this.manager.createEntity(MpEntityType.cogEcmspeResult, key) as CogEcmspeResult;
        }
    }

}
