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

})
export class RoadrunnerComponent implements OnInit {

  roadRunnerInfos: RoadRunner[];
  people: Person[] = [];
  persona: ILoggedInUser = <ILoggedInUser>{};
  courses: Course[] = [];
  workGroups: WorkGroup[] = [];
  activeCourseId: number;
  allStudents: boolean = true;
  studentsOut: IStudentOut[] = [];
  allStudentsOut: IStudentOut[] = [];
  flights: string[] = [];
  stringAllFlights: string[] = [];
  flightsModel: string[] = [];
  flightDisplayed: string = 'All Flights';
  firstFilter: boolean = true;
  count: number = 0;
  signedOut: boolean = false;

  dateFormat = new Intl.DateTimeFormat('en-US');


  columns: ITdDataTableColumn[] = [
    { name: 'flight', label: 'Flight', sortable: true },
    //{ name: 'firstName', label: 'First Name', sortable: false },
    // { name: 'lastName', label: 'Last Name', sortable: true },
    { name: 'name', label: 'Name' },
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



  goBack(route: string): void {
    this.router.navigate(['/']);
  }


  filterFlights(value: string): void {
    this.flights = this.stringAllFlights.filter((item: any) => {

      return item.toLowerCase().indexOf(value.toLowerCase()) > -1;



    }).filter((filteredItem: any) => {
      return this.flightsModel ? this.flightsModel.indexOf(filteredItem) < 0 : true;
    });

  }
  add(): void {
    this.studentsOut = this.allStudentsOut.filter(stu => {
      let match = false;

      this.flightsModel.forEach(item => {
        let temp = stu.flight;
        if (temp === item) {
          match = true;
        }
      });
      return match;
    });
  }

  remove(): void {
    if (this.flightsModel.length > 0) {
      this.studentsOut = this.allStudentsOut.filter(stu => {
        let match = false;

        this.flightsModel.forEach(item => {
          let temp = stu.flight;
          if (temp === item) {
            match = true;
          }
        });
        return match;
      });
    } else {
      this.studentsOut = this.allStudentsOut
    }
  }

  signOut(edit): void {

    if (edit.signOut) {
      edit.prevSignOut = true;
      this.count = this.count + 1;
      this.roadRunnerInfos.forEach(element => {
        element['signedOutSomewhere'] = false;
      });
    } else {
      this.roadRunnerInfos.forEach(element => {
        element['signedOutSomewhere'] = true;
      });
    }

    edit.signOut = !edit.signOut;
    this.loadingService.register(this.roadRunnerLoading);
    this.userDataContext.commit()
      .then((res) => {
        this.loadingService.resolve(this.roadRunnerLoading);
      })
    this.roadRunnerInfos.sort((x, y) => { if (y.signOut === true) return 1; });

  }

  clone(edit) {
    let newAddress = this.userDataContext.addRoadRunner();
    newAddress.location = edit.location;
    newAddress.phoneNumber = edit.phoneNumber;
    newAddress.prevSignOut = false;

    this.roadRunnerInfos.push(newAddress);

  }

  ngOnInit(): void {

    this.titleService.setTitle('RoadRunner');
    this.loadUsers();

    this.global.persona.subscribe((user) => {
      console.log("User has been updated in app Component")
      this.persona = user;

      if (this.persona != null) {
        this.pullProperData();
      }
    });

  }

  pullProperData(): void {
    var that = this;
    if (this.persona.isStudent) {
      this.getRoadRunnerInfo();
      this.roadRunnerService.roadRunnerData.subscribe((road) => {
        console.log("roadrunner update")
        this.roadRunnerInfos = road;


        if (this.roadRunnerInfos.length > 0) {

          for (let info of this.roadRunnerInfos) {
            var templocation = info.location;
            var arrayOfLocation = templocation.split("\n");

            info['splitLocation'] = arrayOfLocation;

            if (info.prevSignOut) {
              this.count = this.count + 1;
            }

            if (info.signOut) {

              this.roadRunnerInfos.sort((x, y) => { if (y.signOut === true) return 1; });

              this.roadRunnerInfos.forEach(element => {
                element['signedOutSomewhere'] = true;
              });
            }

          }

        }
      })
    }
    else {
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

          this.flightDisplayed = (courses[0].academyId + courses[0].classNumber)

          this.facultyDataContext.fetchRoadRunnerWorkGroups(this.activeCourseId)
            .then(initFacultyResponse)
            .catch(e => {
              console.log('error getting work groups');
              console.log(e);
            })
        });

    }

    function initFacultyResponse(wkGroups: WorkGroup[]) {

      var currentWroups = wkGroups;
      that.workGroups = currentWroups;
      that.all();
    }

  }



  all(): void {

    const that = this;
    var memsAdd: IStudentOut[] = [];
    //this.flights.push('All Flights');

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
    this.flights = this.flights.filter(function (elem, index, self) {
      return index == self.indexOf(elem);
    })

    this.stringAllFlights = this.flights;
    this.loadingService.resolve(this.roadRunnerLoading);

  }



  getRoadRunnerInfo(): void {

    this.roadRunnerService.getRoadRunnerInfo()
    this.roadRunnerInfos = this.roadRunnerService.roadRunnerData.value;

  }

  loadUsers(): void {

    this.userDataContext.getUsers()
      .then((people) => {
        this.people = people;
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

