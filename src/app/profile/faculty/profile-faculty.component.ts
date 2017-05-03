import { Component, OnInit, Input } from '@angular/core';

import { ProfileFaculty } from "../../core/entities/user";

@Component({
  selector: 'ecat-profile-faculty',
  templateUrl: './profile-faculty.component.html',
  styleUrls: ['./profile-faculty.component.scss']
})
export class ProfileFacultyComponent implements OnInit {

  @Input() profile: ProfileFaculty;

  constructor() { }

  ngOnInit() {
  }

}
