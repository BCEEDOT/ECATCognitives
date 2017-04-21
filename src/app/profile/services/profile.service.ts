import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EmProviderService } from "../../core/services/em-provider.service";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp } from "breeze-client";

import { ProfileStudent, UserRegistrationHelper } from "../../core/entities/user";
import { GlobalService } from "../../core/services/global.service";


@Injectable()
export class ProfileService {

  em: EntityManager;

  constructor(private regHelper: UserRegistrationHelper, private emProvider: EmProviderService, private global: GlobalService) {

    //Need to point to the right repo
    //this.em = this.emProvider.getManager();

  }

  getProfile(): Promise<ProfileStudent> {

    //TODO: No Magic strings
    let query = EntityQuery.from('profiles');

    return <Promise<ProfileStudent>>this.em.executeQuery(query)
      .then(res => {
        return res.results[0] as ProfileStudent
      })
      .catch(e => {
        console.log('Did not retrieve profile' + e);
        return Promise.reject(e);
      });
  }
}
