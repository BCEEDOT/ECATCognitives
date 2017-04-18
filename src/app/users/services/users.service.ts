import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EmProviderService } from "../../core/services/em-provider.service";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp } from "breeze-client";

import { Person, UserRegistrationHelper } from "../../core/entities/user";


@Injectable()
export class UsersService {

  em: EntityManager;
  person: Person[] = [];

  constructor(private regHelper: UserRegistrationHelper, private emProvider: EmProviderService) {
    this.em = this.emProvider.getManager();
  }

  getUsers(): Promise<Person[]> {
    
    let query = EntityQuery.from('getusers');

    return <Promise<Person[]>>this.em.executeQuery(query)
      .then(res => res.results as Person[])
      .catch(e => {
        console.log('Did not retrieve users' + e);
        return Promise.reject(e);
      });
  }
}
