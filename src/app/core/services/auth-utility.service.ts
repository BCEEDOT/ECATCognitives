import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp, EntityState, MergeStrategy } from "breeze-client";
import { Router, Route } from '@angular/router';

import { EmProviderService } from "./em-provider.service";
import { IPerson } from "../entities/client-entities";
import { GlobalService } from "./global.service";
import { Person } from "../entities/user";

@Injectable()
export class AuthUtilityService {

    ecatUserIdToken: Person;
    ecatAccessToken: any;
    em: EntityManager;

    constructor(private jwtHelper: JwtHelper, private global: GlobalService, private emProviderService: EmProviderService, private router: Router) { }

    public validateToken(ecatAccessToken: any): boolean {

        if (!ecatAccessToken) { console.log('Token does not exist'); return false };

        if (this.jwtHelper.isTokenExpired(ecatAccessToken)) { console.log('Token has expired'); return false; }

        return true;
    }

    public login(ecatUserIdToken: any, ecatAccessToken: any): boolean {

        if (!ecatUserIdToken && !ecatAccessToken) { return false; }

        this.ecatUserIdToken = this.jwtHelper.decodeToken(ecatUserIdToken);
        this.ecatAccessToken = this.jwtHelper.decodeToken(ecatAccessToken);

        var em = this.emProviderService.getManager();

        var loggedInUser = {
            personId: this.ecatAccessToken.sub,
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

        var user = em.createEntity("Person", loggedInUser, EntityState.Unchanged, MergeStrategy.PreserveChanges) as IPerson;
        this.global.user(user);
        return true;

    }

    public logout() {
        localStorage.removeItem('ecatAccessToken');
        localStorage.removeItem('ecatUserIdToken');
        this.router.navigate(['/login']);
    }

}