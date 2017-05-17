import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdMediaService, ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableSortingOrder, TdDataTableService, CovalentExpansionPanelModule } from '@covalent/core';

import { Person, RoadRunner } from "../core/entities/user";
import { GlobalService, ILoggedInUser } from "../core/services/global.service";
import { UserDataContext } from "../core/services/data/user-data-context.service";
import {RoadrunnerService } from './services/roadrunner.service';


//import { DialogComponent } from "../roadrunner/roadrunner.dialog.component";

@Component({
  //Selector only needed if another template is going to refernece
  selector: 'qs-roadrunner',
  templateUrl: './roadrunner.component.html',
  styleUrls: ['./roadrunner.component.scss']
  //Limits only to current view and not children
  //viewProviders: [ UsersService ],
})
export class RoadrunnerComponent implements OnInit {

  // searchTerm: string = '';
  // fromRow: number = 1;
  // currentPage: number = 1;
  // pageSize: number = 5;
  // sortBy: string = 'LeaveDate';
  // sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  constructor(private titleService: Title,
    private router: Router,
    private loadingService: TdLoadingService,
    //private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    //private dialog: MdDialog,
    private userDataContext: UserDataContext,
    private _dataTableService: TdDataTableService,
    //private dialogComponent: DialogComponent,
    //private usersService: UsersService,
    public media: TdMediaService,
    private global: GlobalService,
    private roadRunnerService: RoadrunnerService
  ) { }




  roadRunnerInfos: RoadRunner [];

  people: Person[] = [];

  persona: ILoggedInUser = <ILoggedInUser>{};



  goBack(route: string): void {
    this.router.navigate(['/']);
  }


  signOut(edit): void {
    edit.signOut = !edit.signOut;
    this.loadingService.register('updateRoadrunner');
    this.userDataContext.commit()
      .then((res)=>{
        this.loadingService.resolve('updateRoadrunner');
        console.log('check roadrunner database');
      })

    console.log(edit);
  }

  clone(edit){
  let newAddress = this.userDataContext.addRoadRunner();

 newAddress.location = edit.location;
 newAddress.phoneNumber = edit.phoneNumber;
 newAddress.prevSignOut = false;

this.roadRunnerInfos.push(newAddress);

  console.log(newAddress);
  console.log(this.roadRunnerInfos)
}
  // collapsedEvent(): void {

  // }


  ngOnInit(): void {



    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.titleService.setTitle('ECAT Users');
    this.loadUsers();

    this.getRoadRunnerInfo();


    this.roadRunnerService.roadRunnerData.subscribe((road)=>{
      console.log("roadrunner update")
      this.roadRunnerInfos = road;
      console.log(this.roadRunnerInfos)
    })


    console.log("App on init is firing");


    this.global.persona.subscribe((user) => {
      console.log("User has been updated in app Component")
      this.persona = user;
    });


    // check if this is a student then call the correct service to pull data
    // if (this.persona.isStudent) {
    //   console.log("ROADRUNNER STUDENT");

    // }


  }

  getRoadRunnerInfo():void{

    this.roadRunnerService.getRoadRunnerInfo()   
    console.log(this.roadRunnerService.roadRunnerData.value);
    this.roadRunnerInfos = this.roadRunnerService.roadRunnerData.value;

  }

  loadUsers(): void {
    //maps to ng-template tag
    this.loadingService.register('person.list');
    this.userDataContext.getUsers()
      .then((people) => {
        this.people = people;
        this.loadingService.resolve('person.list');
        console.log(this.people);
      })
      .catch(e => {
        this.loadingService.resolve('person.list');
        console.log('error getting users');
        console.log(e);
      })

  }


}



// @Component({
//   selector: 'dialog-example',
//   templateUrl: './roadrunner.dialog.html',
//   //clickOutsideToClose: false
// })

// export class DialogComponent { }


  //userData: any[];

//  columns: ITdDataTableColumn[] = [
//     { name: 'location', label: 'Location', sortable: true },
//     { name: 'phoneNumber', label: 'Contact Number', sortable: false },
//     { name: 'LeaveDate', label: 'Start', sortable: true },
//     { name: 'ReturnDate', label: 'End', sortable: true },
//     { name: 'id', label: "" }
//   ]

  // sort(sortEvent: ITdDataTableSortChangeEvent): void {
  //   this.sortBy = sortEvent.name;
  //   this.sortOrder = sortEvent.order;
  //   this.filter();

  // }

  // filter(): void {
  //   let newData: any[] = this.userData;
  //   newData = this._dataTableService.filterData(newData, this.searchTerm, true);
  //   this.filteredTotal = newData.length;
  //   newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
  //   newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
  //   this.filteredData = newData;
  // }



  //filteredData: any[] = this.userData;
  //filteredTotal: number = this.userData.length;