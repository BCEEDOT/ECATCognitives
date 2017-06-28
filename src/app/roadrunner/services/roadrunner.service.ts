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

//roadRunnerLoading = 'roadRunnerLoading';

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
      //persona: BehaviorSubject<ILoggedInUser> = new BehaviorSubject({} as ILoggedInUser);

  //user(user: ILoggedInUser) {
  //  this.persona.next(user);
 // }

//roadInfo = this.roadRunnerData.value;





 //= [];
// constructor(private loadingService: TdLoadingService, private userDataContext: UserDataContext){

// }

// getRoadRunnerInfo(): Promise<RoadRunner[]> {
// //getRoadRunnerInfo(): void{
// //this.loadRoadRunnerInfo();

//     this.loadingService.register(this.roadRunnerLoading);
//     this.userDataContext.getRoadRunnerInfos()
//       .then((roadRunnerData) => {
//         //this.roadRunnerData(roadRunnerData);
//         return 
//         this.loadingService.resolve(this.roadRunnerLoading);
        
//         //console.log(this.roadRunnerData.value);
//         //return Promise.resolve(this.roadRunnerData);
//       })
//       .catch(e => {
//         this.loadingService.resolve(this.roadRunnerLoading);
//         console.log('error getting roadrunner info');
//         console.log(e);
//       })

// }


// addRoadRunner(){
//   const newAddress = this
// }
 //getOneRoadRunnerInfo(id:number){

    //  this.loadingService.register('roadrunnerdata.list');
    //  this.userDataContext.getRoadRunnerInfos()
    //    .then((roadRunnerData) => {
    //      this.road(roadRunnerData);
    //      this.loadingService.resolve('roadrunnerdata.list')
        
    //      console.log(this.roadRunnerData.value);
    //      //return Promise.resolve(this.roadRunnerData);
    //    })
    //    .catch(e => {
    //     this.loadingService.resolve('roadrunnerdata.list');
    //     console.log('error getting roadrunner info');
    //      console.log(e);
    //    })
// console.log(this.roadInfo)
//    return this.roadInfo;
//  }



//   loadRoadRunnerInfo(): void {

//     this.loadingService.register('RoadRunner.list');
//     this.userDataContext.getRoadRunnerInfos()
//       .then((roadRunnerData) => {
//         this.roadRunnerData = roadRunnerData;
//         this.loadingService.resolve('RoadRunner.list')
        
//         console.log(this.roadRunnerData);
//         //return Promise.resolve(this.roadRunnerData);
//       })
//       .catch(e => {
//         this.loadingService.resolve('roadRunnerData.list');
//         console.log('error getting roadrunner info');
//         console.log(e);
//       })


//   }

    // getRoadrunners(){

    //     return USERDATA;

    // }

    // getRoadrunner(id:number){

    //     return USERDATA.find(data => data.id ==-id)
    // }
//}


//  const USERDATA: any[] = [
//     {
//       'id': 1,
//       'location': 'My house',
//       'phoneNumber': '1111111111',
//       'LeaveDate': '3 May 1990',
//       'ReturnDate': '5 May 1990',
//       'editing': false,
//       'details':false,
//       'signedOut':false,
//       'prevSignOut': false
//     },
//     {
//       'id': 2,
//       'location': 'My Girls house',
//       'phoneNumber': '5555555555',
//       'LeaveDate': '26 May 1990',
//       'ReturnDate': '28 May 1990',
//       'editing': false,
//       'details':false,
//       'signedOut':false,
//       'prevSignOut': false
//     },
//     {
//       'id': 3,
//       'location': 'Another Girls house',
//       'phoneNumber': '666666666',
//       'LeaveDate': '26 April 2014',
//       'ReturnDate': '28 April 2014',
//       'editing': false,
//       'details':false,
//       'signedOut':false,
//       'prevSignOut': true
//     },
//         {
//       'id': 4,
//       'location': 'home',
//       'phoneNumber': '123456789',
//       'LeaveDate': '26 April 2014',
//       'ReturnDate': '28 April 2014',
//       'editing': false,
//       'details':false,
//       'signedOut':true,
//       'prevSignOut': false
//     }


//   ]

}