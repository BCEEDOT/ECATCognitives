import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/pluck';

import { Course, WorkGroup } from '../../../core/entities/faculty';

@Component({
  selector: 'qs-app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  workGroups: WorkGroup[];
  strings: string[] = [
    'Flight1',
    'Flight2',
    'Flight3',
    'Flight4',
  ];

  filteredStrings: string[];
  stringsModel: string[] = this.strings.slice(0, 0);

  course$: Observable<Course>;
  course: Course;

  options: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.course$ = this.route.data.pluck('course');
  }

  ngOnInit(): void {
    this.filterStrings('');
    this.course$.subscribe((course: Course) => {
      this.course = course;
      this.activate();
    });
  }

  activate(): void {

    if (this.course.workGroups) {
      this.workGroups = this.course.workGroups;
      this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
        if (wgA.mpCategory < wgB.mpCategory) {
          return -1;
        }
        else if (wgA.mpCategory > wgB.mpCategory) {
          return 1
        }

        if (wgA.groupNumber < wgB.groupNumber) {
          return +wgA.groupNumber - +wgB.groupNumber;
        }

        else if (wgA.groupNumber < wgB.groupNumber) {
          return +wgB.groupNumber - +wgA.groupNumber;
        } else {

          return 0;
        }
      });

    }
  }

  filterStrings(value: string): void {
    if (value) {
      this.filteredStrings = this.strings.filter((item: any) => {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      }).filter((filteredItem: any) => {
        return this.stringsModel ? this.stringsModel.indexOf(filteredItem) < 0 : true;
      });
    }
  }



}
