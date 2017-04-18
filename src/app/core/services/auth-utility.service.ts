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
    ecatUserToken: any;
    em: EntityManager;

    constructor(private jwtHelper: JwtHelper, private global: GlobalService, private emProviderService: EmProviderService) { }

    public validateToken(ecatUserToken: any): boolean {

        if (!ecatUserToken) { console.log('Token does not exist'); return false };

        if (this.jwtHelper.isTokenExpired(ecatUserToken)) { console.log('Token has expired'); return false; }

        return true;
    }

    public loginUser(ecatUserIdToken: any, ecatUserToken: any): boolean {

        if (!ecatUserIdToken && !ecatUserToken) { return false; }

        this.ecatUserIdToken = this.jwtHelper.decodeToken(ecatUserIdToken) as IdToken;
        this.ecatUserToken = this.jwtHelper.decodeToken(ecatUserToken);

        this.global.accessToken = ecatUserToken;

        var em = this.emProviderService.getManager();

        var loggedInUser = {
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

        em.createEntity("Person", loggedInUser, EntityState.Unchanged, MergeStrategy.PreserveChanges);

        return true;

    }



}