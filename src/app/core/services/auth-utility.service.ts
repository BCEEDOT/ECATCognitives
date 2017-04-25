import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp, EntityState, MergeStrategy } from "breeze-client";
import { Router, Route } from '@angular/router';

import { EmProviderService } from "./em-provider.service";
import { IPerson } from "../entities/client-models";
import { GlobalService } from "./global.service";
import { Person } from "../entities/user";
import { DataContext } from '../../app-constants';

@Injectable()
export class AuthUtilityService {

    ecatUserIdToken: Person;
    ecatAccessToken: any;
    em: EntityManager;

    constructor(private jwtHelper: JwtHelper,  private global: GlobalService, private emProviderService: EmProviderService, private router: Router) { }

    // public validateToken(ecatAccessToken: any) {

    //     if (!ecatAccessToken) { console.log('Token does not exist'); return false };

    //     if (this.jwtHelper.isTokenExpired(ecatAccessToken)) { console.log('Token has expired'); return false; }

    //     return true;
    // }

    // public login(ecatUserIdToken: any, ecatAccessToken: any) {

    //     if (!ecatUserIdToken && !ecatAccessToken) { return false; }

    //     this.ecatUserIdToken = this.jwtHelper.decodeToken(ecatUserIdToken);
    //     this.ecatAccessToken = this.jwtHelper.decodeToken(ecatAccessToken);

    //     var loggedInUser = {
    //         personId: this.ecatAccessToken.sub,
    //         lastName: this.ecatUserIdToken.lastName,
    //         firstName: this.ecatUserIdToken.firstName,
    //         isActive: true,
    //         mpGender: this.ecatUserIdToken.mpGender,
    //         mpAffiliation: this.ecatUserIdToken.mpAffiliation,
    //         mpPaygrade: this.ecatUserIdToken.mpPaygrade,
    //         mpComponent: this.ecatUserIdToken.mpComponent,
    //         email: this.ecatUserIdToken.email,
    //         registrationComplete: true,
    //         mpInstituteRole: this.ecatUserIdToken.mpInstituteRole
    //     } as IPerson;

    //     this.global.user(loggedInUser);
    //     this.global.isLoggedIn(true);
    //     this.global.isFaculty(false);

    // }

    // public logout() {
    //     localStorage.removeItem('ecatAccessToken');
    //     localStorage.removeItem('ecatUserIdToken');
    //     this.router.navigate(['/login']);
    // }

    // public isAuthorized() {

    // }

}