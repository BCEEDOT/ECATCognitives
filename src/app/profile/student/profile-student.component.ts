import { Component, OnInit, Input } from '@angular/core';

import { ProfileStudent } from "../../core/entities/user";

@Component({
  selector: 'ecat-profile-student',
  templateUrl: './profile-student.component.html',
  styleUrls: ['./profile-student.component.scss']
})
export class ProfileStudentComponent implements OnInit {
  @Input() profile: ProfileStudent;

  constructor() { }

  ngOnInit() {
    //console.log("this is the profile from profile-main");
    console.log(this.profile);
  }

}
