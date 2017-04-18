import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";
import { GlobalService } from "./global.service";
import { Person } from "../entities/user";
import { IdToken } from "../entities/client-entities";
import { EmProviderService } from "./em-provider.service";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp, EntityState, MergeStrategy } from "breeze-client";


@Injectable()
export class AuthUtilityService {

    ecatUserIdToken: any;
    ecatAccessToken: any;
    em: EntityManager;

    constructor(private jwtHelper: JwtHelper, private global: GlobalService, private emProviderService: EmProviderService) { }

    public validateToken(ecatAccessToken: any): boolean {

        if (!ecatAccessToken) { console.log('Token does not exist'); return false };

        if (this.jwtHelper.isTokenExpired(ecatAccessToken)) { console.log('Token has expired'); return false; }

        return true;
    }

    public loginUser(ecatUserIdToken: any, ecatAccessToken: any): boolean {

        if (!ecatUserIdToken && !ecatAccessToken) { return false; }

        this.ecatUserIdToken = this.jwtHelper.decodeToken(ecatUserIdToken) as IdToken;
        this.ecatAccessToken = this.jwtHelper.decodeToken(ecatAccessToken);

        //this.global.accessToken = ecatAccessToken;

        var em = this.emProviderService.getManager();

        var loggedInUser = {
            //Todo: Remove hardcoded personId
            personId: 2,
            lastName: this.ecatUserIdToken.lastName,
            firstName: this.ecatUserIdToken.firstName,
            isActive: true,
            mpGender: this.ecatUserIdToken.mpGender,
            mpAffiliation: this.ecatUserIdToken.mpAffiliation,
            mpPaygrade: this.ecatUserIdToken.mpPaygrade,
            mpComponent: this.ecatUserIdToken.mpComponent,
            email: this.ecatUserIdToken.email,
            registrationComplete: true,
            mpInstituteRole: this.ecatUserIdToken.mpInstituteRole
        } as Person;

        this.global.loggedInUser = loggedInUser;
        em.createEntity("Person", loggedInUser, EntityState.Unchanged, MergeStrategy.PreserveChanges);

        return true;

    }



}