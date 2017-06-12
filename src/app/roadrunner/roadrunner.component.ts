import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdMediaService, ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableSortingOrder, TdDataTableService, CovalentExpansionPanelModule } from '@covalent/core';

import { Person, RoadRunner } from "../core/entities/user";
import { GlobalService, ILoggedInUser } from "../core/services/global.service";
import { UserDataContext } from "../core/services/data/user-data-context.service";
import {RoadrunnerService } from './services/roadrunner.service';

@Component({
  selector: 'qs-roadrunner',
  templateUrl: './roadrunner.component.html',
  styleUrls: ['./roadrunner.component.scss']
  //Limits only to current view and not children

})
export class RoadrunnerComponent implements OnInit {


  roadRunnerLoading = 'roadRunnerLoading';

  constructor(private titleService: Title,
    private router: Router,
    private loadingService: TdLoadingService,
    private snackBarService: MdSnackBar,
    private userDataContext: UserDataContext,
    private _dataTableService: TdDataTableService,
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

    if(edit.signOut){
      edit.prevSignOut = true;
    }

    edit.signOut = !edit.signOut;
    this.loadingService.register(this.roadRunnerLoading);
    this.userDataContext.commit()
      .then((res)=>{
        this.loadingService.resolve(this.roadRunnerLoading);
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
    console.log(this.roadRunnerInfos);
  }


  ngOnInit(): void {

    this.media.broadcast();
    this.titleService.setTitle('ECAT Users');
    //this.loadingService.register(this.roadRunnerLoading);
    this.loadUsers();
    this.getRoadRunnerInfo();
    this.roadRunnerService.roadRunnerData.subscribe((road)=>{
      console.log("roadrunner update")
      this.roadRunnerInfos = road;
      console.log(this.roadRunnerInfos)

      if (this.roadRunnerInfos.length > 0){
        for (let info of this.roadRunnerInfos){
            var templocation = info.location;

            console.log(templocation)
            console.log(info.id)
          var arrayOfLocation = templocation.split("\n");
          console.log(arrayOfLocation);

          info['splitLocation'] = arrayOfLocation;
        }

      console.log(this.roadRunnerInfos)

      }
      //Trying to break up the locations

      //var templocation = this.roadRunnerInfos[1].location;

      //console.log(templocation)
     //var arrayOfLocation = templocation.split("\n");
     //console.log(arrayOfLocation);


            // this.inventoryList.forEach(item => {
            //     item.responseForAssessee.entityAspect.rejectChanges();
            //     item['isChanged'] = false;
            //     if (item['showBehavior']) { this.closeEditAssessItem(item, false) }
            // });

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

    this.userDataContext.getUsers()
      .then((people) => {
        this.people = people;
        console.log(this.people);
      })
      .catch(e => {
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