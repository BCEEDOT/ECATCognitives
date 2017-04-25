import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp, EntityState, MergeStrategy } from "breeze-client";
import { Router, Route } from '@angular/router';

import { EmProviderService } from "./em-provider.service";
import { GlobalService } from "./global.service";
import { Person } from "../entities/user";
import { DataContext } from '../../app-constants';

@Injectable()
export class AuthUtilityService {

    ecatUserIdToken: Person;
    ecatAccessToken: any;
    em: EntityManager;

    constructor(private jwtHelper: JwtHelper,  private global: GlobalService, private emProviderService: EmProviderService, private router: Router) { }

}