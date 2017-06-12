import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { Course, WorkGroup } from "../../../core/entities/faculty";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  readOnly: boolean = false;
  chipAddition: boolean = true;

  items: string[] = [
    'Flight 1',
    'Flight 2',
    'Flight 3',
    'Flight 4',
  ];

  course$: Observable<Course>;
  course: Course;


  itemsRequireMatch: string[] = this.items.slice(0, 6);

  constructor(private route: ActivatedRoute) { 
    this.course$ = this.route.data.pluck('course');
  }

  ngOnInit() {
    this.course$.subscribe(course => {
      this.course = course;
      console.log(this.course);
    })

    
  }

}
