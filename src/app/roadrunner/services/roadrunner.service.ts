// import { Injectable, OnInit } from '@angular/core';
// import { Response } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp } from "breeze-client";

// import { EmProviderService } from "../../core/services/em-provider.service";
// import { Person, UserRegistrationHelper } from "../../core/entities/user";


// @Injectable()
// export class UsersService {

//   em: EntityManager;
//   person: Person[] = [];

//   constructor(private regHelper: UserRegistrationHelper, private emProvider: EmProviderService) {
//     this.em = this.emProvider.getManager();
//   }

//   getUsers(): Promise<Person[]> {
    
//     let query = EntityQuery.from('getusers');

//     return <Promise<Person[]>>this.em.executeQuery(query)
//       .then(res => res.results as Person[])
//       .catch(e => {
//         console.log('Did not retrieve users' + e);
//         return Promise.reject(e);
//       });
//   }
// }
import { RoadRunner } from "../../core/entities/user";
import { UserDataContext } from "../../core/services/data/user-data-context.service";
import { TdLoadingService } from '@covalent/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/RX';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class RoadrunnerService{

roadRunnerData$:  BehaviorSubject<RoadRunner[]> = new BehaviorSubject({} as RoadRunner[]);

count$:  BehaviorSubject<number> = new BehaviorSubject(0);
signedOut$: BehaviorSubject<boolean> = new BehaviorSubject(false);


roadRunnerData(roadRunnerData: RoadRunner[]){
    this.roadRunnerData$.next(roadRunnerData);
}

count(count: number){
    this.count$.next(count);
}

signedOut(signedOut: boolean){
  this.signedOut$.next(signedOut);
}


}