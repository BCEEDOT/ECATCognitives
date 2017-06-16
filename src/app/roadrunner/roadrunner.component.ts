import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdMediaService, ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableSortingOrder, TdDataTableService, CovalentExpansionPanelModule } from '@covalent/core';

import { Person, RoadRunner } from "../core/entities/user";
import { GlobalService, ILoggedInUser } from "../core/services/global.service";
import { UserDataContext } from "../core/services/data/user-data-context.service";
import { RoadrunnerService } from './services/roadrunner.service';
import { FacultyDataContextService } from "../faculty/services/faculty-data-context.service";
import { Course, WorkGroup } from "../core/entities/faculty";

@Component({
  selector: 'qs-roadrunner',
  templateUrl: './roadrunner.component.html',
  styleUrls: ['./roadrunner.component.scss']
  //Limits only to current view and not children

})
export class RoadrunnerComponent implements OnInit {

  roadRunnerInfos: RoadRunner[];
  people: Person[] = [];
  persona: ILoggedInUser = <ILoggedInUser>{};
  courses: Course[] = [];
  //private courses: Array<ecat.entity.ICourse>;
  //protected workGroups: Array<ecat.entity.IWorkGroup> = [];
  workGroups: WorkGroup[] = [];
  activeCourseId: number;
  allStudents: boolean = true;
  studentsOut: IStudentOut[] = [];
  allStudentsOut: IStudentOut [] = [];
  flights: string[]= [];
  flightDisplayed: string = 'All Flights';
  firstFilter: boolean = true;

  dateFormat = new Intl.DateTimeFormat('en-US');


  columns: ITdDataTableColumn[] = [
    { name: 'flight', label: 'Flight', sortable: true },
    //{ name: 'firstName', label: 'First Name', sortable: false },
   // { name: 'lastName', label: 'Last Name', sortable: true },
    { name: 'name', label:'Name'},
    { name: 'location', label: 'Location', sortable: false },
    { name: 'leaveDate', label: 'Leave Date', sortable: true, format: date => this.dateFormat.format(date) },
    { name: 'returnDate', label: 'Return Date', sortable: true, format: date => this.dateFormat.format(date) },
    { name: 'contactNumber', label: 'Contact Number', sortable: false }
  ]

  columns2: ITdDataTableColumn[] = [
    { name: 'flight', label: 'Flight', sortable: true },
    { name: 'lastName', label: 'Last Name', sortable: true },
    { name: 'leaveDate', label: 'Leave Date', sortable: true, format: date => this.dateFormat.format(date) },
    { name: 'contactNumber', label: 'Contact Number', sortable: false }
  ]

  // firstName: outAdd.person.firstName,
  // lastName: outAdd.person.lastName,
  // leaveDate: outAdd.leaveDate,
  // returnDate: outAdd.returnDate,
  // location: outAdd.location,
  // flight: gm.workGroup.defaultName,
  // contactNumber: outAdd.phoneNumber



  roadRunnerLoading = 'roadRunnerLoading';

  constructor(private titleService: Title,
    private router: Router,
    private loadingService: TdLoadingService,
    private snackBarService: MdSnackBar,
    private userDataContext: UserDataContext,
    private facultyDataContext: FacultyDataContextService,
    private _dataTableService: TdDataTableService,
    public media: TdMediaService,
    private global: GlobalService,
    private roadRunnerService: RoadrunnerService
  ) { }


  //   roadRunnerInfos: RoadRunner [];
  //   people: Person[] = [];
  //   persona: ILoggedInUser = <ILoggedInUser>{};
  //   courses: Course[] = [];
  // //private courses: Array<ecat.entity.ICourse>;
  // //protected workGroups: Array<ecat.entity.IWorkGroup> = [];
  //   workGroups: Array<IWorkGroup> = [];
  //   activeCourseId: number;

  goBack(route: string): void {
    this.router.navigate(['/']);
  }
  // add(flight): void{
  //   //this.studentsOut = this.allStudentsOut;
  //   var that = this;
  //   if(flight === "All Flights"){
  //     this.studentsOut = this.allStudentsOut;
  //   }else{
  //     var temp = this.allStudentsOut.filter(flt => flt.flight === flight);
  //     if(temp != null){
        
  //       that.studentsOut = this.allStudentsOut.filter(flt => flt.flight === flight);
  //       this.firstFilter = false;
  //     }else{
  //     var temp = this.allStudentsOut.filter(flt => flt.flight === flight);
  //       if(temp != null){
  //     temp.forEach(tp => {that.studentsOut.push(tp)});
  //       }
  //   //this.studentsOut.push(temp);
  //     }
  // }
  
  //   this.flightDisplayed = flight;
  //   console.log(that.studentsOut);
  //   console.log('filter has been hit')
  // }

  filter(flight): void{
    //this.studentsOut = this.allStudentsOut;
    if(flight === "All Flights"){
      this.studentsOut = this.allStudentsOut;
    }else{
    this.studentsOut = this.allStudentsOut.filter(flt => flt.flight === flight);
  }
  
    this.flightDisplayed = flight;
    console.log(this.studentsOut);
    console.log('filter has been hit')
  }

  signOut(edit): void {

    if (edit.signOut) {
      edit.prevSignOut = true;
    }

    edit.signOut = !edit.signOut;
    this.loadingService.register(this.roadRunnerLoading);
    this.userDataContext.commit()
      .then((res) => {
        this.loadingService.resolve(this.roadRunnerLoading);
        console.log('check roadrunner database');
      })

    console.log(edit);
  }

  clone(edit) {
    let newAddress = this.userDataContext.addRoadRunner();
    newAddress.location = edit.location;
    newAddress.phoneNumber = edit.phoneNumber;
    newAddress.prevSignOut = false;

    this.roadRunnerInfos.push(newAddress);

    console.log(newAddress);
    console.log(this.roadRunnerInfos);
  }


  ngOnInit(): void {

    //this.media.broadcast();
    this.titleService.setTitle('RoadRunner');
    //this.loadingService.register(this.roadRunnerLoading);
    this.loadUsers();

    this.global.persona.subscribe((user) => {
      console.log("User has been updated in app Component")
      this.persona = user;
      console.log(this.persona);
      if (this.persona != null) {
        this.pullProperData();
      }
    });

    // if(this.persona.isStudent){
    //   this.getRoadRunnerInfo();
    //   this.roadRunnerService.roadRunnerData.subscribe((road)=>{
    //     console.log("roadrunner update")
    //     this.roadRunnerInfos = road;
    //     console.log(this.roadRunnerInfos)

    //     if (this.roadRunnerInfos.length > 0){
    //       for (let info of this.roadRunnerInfos){
    //           var templocation = info.location;

    //           console.log(templocation)
    //           console.log(info.id)
    //         var arrayOfLocation = templocation.split("\n");
    //         console.log(arrayOfLocation);

    //         info['splitLocation'] = arrayOfLocation;
    //       }

    //     console.log(this.roadRunnerInfos)

    //     }
    //     //Trying to break up the locations

    //     //var templocation = this.roadRunnerInfos[1].location;

    //     //console.log(templocation)
    //   //var arrayOfLocation = templocation.split("\n");
    //   //console.log(arrayOfLocation);


    //           // this.inventoryList.forEach(item => {
    //           //     item.responseForAssessee.entityAspect.rejectChanges();
    //           //     item['isChanged'] = false;
    //           //     if (item['showBehavior']) { this.closeEditAssessItem(item, false) }
    //           // });

    //   })


    //   console.log("App on init is firing");

    // }


    // check if this is a student then call the correct service to pull data
    // if (this.persona.isStudent) {
    //   console.log("ROADRUNNER STUDENT");

    // }


  }

  pullProperData(): void {
    var that = this;
    if (this.persona.isStudent) {
      this.getRoadRunnerInfo();
      this.roadRunnerService.roadRunnerData.subscribe((road) => {
        console.log("roadrunner update")
        this.roadRunnerInfos = road;
        console.log(this.roadRunnerInfos)

        if (this.roadRunnerInfos.length > 0) {
          for (let info of this.roadRunnerInfos) {
            var templocation = info.location;

            console.log(templocation)
            console.log(info.id)
            var arrayOfLocation = templocation.split("\n");
            console.log(arrayOfLocation);

            info['splitLocation'] = arrayOfLocation;
          }

          console.log(this.roadRunnerInfos)

        }
      })
    }
    else {
      //get instructor stuff
      this.loadingService.register(this.roadRunnerLoading);
      this.facultyDataContext.initCourses()
        .then((courses: Course[]) => {
          this.courses = courses;

          this.courses.sort((crseA: Course, crseB: Course) => {
            if (crseA.startDate < crseB.startDate) return 1;
            if (crseA.startDate > crseB.startDate) return -1;
            return 0;
          });


          this.activeCourseId = courses[0].id;

          console.log(this.courses);
          console.log(this.activeCourseId);

          this.facultyDataContext.fetchRoadRunnerWorkGroups(this.activeCourseId)
            .then(initFacultyResponse)
          //.catch(initError)
            // .then((res) => {
            //   initFacultyResponse;
            //   this.loadingService.resolve(this.roadRunnerLoading);
            // });
          
        });



      // this.dCtx.faculty.initFacCourses(force)
      //     .then((courses: Array<ecat.entity.ICourse>) => {
      //         this.courses = courses;
      //         this.activeCourseId = courses[0].id;
      //        *don't think I need this Part* this.dCtx.faculty.activeCourseId = this.activeCourseId;

      //         this.dCtx.faculty.fetchRoadRunnerWorkGroups(force)
      //             .then(initFacultyResponse)
      //             .catch(initError);
      //     });

    }

    function initFacultyResponse(wkGroups: WorkGroup[]) {

      //this.loadingService.resolve(this.roadRunnerLoading);
      var currentWroups = wkGroups;
      that.workGroups = currentWroups;
      that.all();
    }




    console.log("App on init is firing");

  }



  all(): void {

    const that = this;
    var memsAdd: IStudentOut[] = [];
    //this.selFlight = 'All Flights';
    //var flights: string[];

    console.log(this.workGroups);
    this.flights.push('All Flights');

    this.workGroups.forEach(wg => wg.groupMembers.forEach(gm => {
      let outAdd = gm.studentProfile.person.roadRunnerAddresses.filter(rra => rra.signOut === true)[0];

      this.flights.push(gm.workGroup.defaultName);

      if (outAdd != null || outAdd != undefined) {

        memsAdd.push({
          firstName: outAdd.person.firstName,
          lastName: outAdd.person.lastName,
          leaveDate: outAdd.leaveDate,
          returnDate: outAdd.returnDate,
          location: outAdd.location,
          flight: gm.workGroup.defaultName,
          contactNumber: outAdd.phoneNumber,
          name: outAdd.person.firstName + ' ' + outAdd.person.lastName
        });
      }
    }));
    this.allStudents = true;
    this.studentsOut = memsAdd;
    this.allStudentsOut = this.studentsOut;
    console.log(this.studentsOut);
    console.log(this.flights);

    this.flights = this.flights.filter(function(elem, index,self){
      return index == self.indexOf(elem);
    })

    console.log(this.flights);
    this.loadingService.resolve(this.roadRunnerLoading);

  }



  getRoadRunnerInfo(): void {

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

interface IStudentOut {
  firstName: string;
  lastName: string;
  leaveDate: Date;
  returnDate: Date;
  location: string;
  flight: string;
  contactNumber: string;
  name: string;

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