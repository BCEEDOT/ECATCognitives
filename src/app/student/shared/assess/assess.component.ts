import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/mergeAll';

import { Course } from "../../../core/entities/student/course";

@Component({
  selector: 'app-assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

  courses: Observable<Course[]>

  constructor(private route: ActivatedRoute) { 
    this.courses = <any>route.data.pluck['course'];
  }

  ngOnInit() {
  }

}
