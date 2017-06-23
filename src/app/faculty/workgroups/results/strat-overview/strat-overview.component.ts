import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup, CrseStudentInGroup, StratResponse, FacStratResponse } from "../../../../core/entities/faculty";

interface memberStrats {
  //studentId: number;
  memberStratsgave: stratsGave[]
}

interface stratsGave {
  //assesseePersonId: number,
  strat: number
}

@Component({
  selector: 'strat-overview',
  templateUrl: './strat-overview.component.html',
  styleUrls: ['./strat-overview.component.scss']
})


export class StratOverviewComponent implements OnInit {

  @Input() membersResults: CrseStudentInGroup[];

  membersStrats = [];
  memberNames: string[]; 
  studentIds: number[] = [];
  facultyStrat: number[] = [];
  finalStrat: number[] = [];


  constructor() { }

  ngOnInit() {

    this.membersResults.sort((a: CrseStudentInGroup, b: CrseStudentInGroup) => {
      if (a.studentProfile.person.lastName > b.studentProfile.person.lastName) { return 1; }
      if (a.studentProfile.person.lastName < b.studentProfile.person.lastName) { return -1; }
      return 0;
    });

    this.membersResults.forEach(member => {
      member.updateStatusOfStudent();
      this.finalStrat[member.studentId.toString()] = member.stratResult.finalStratPosition;
      this.facultyStrat[member.studentId.toString()] = member.facultyStrat.stratPosition;
      this.studentIds.push(member.studentId);
    })

    console.log(this.facultyStrat);




  }

}
