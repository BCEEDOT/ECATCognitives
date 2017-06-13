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
  workGroupOrig: WorkGroup[];
  strings: string[] = [
    'Flight 1'
  ];

  filteredStrings: string[] = [];
  stringsModel: string[] = [];

  course$: Observable<Course>;
  course: Course;

  options: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.course$ = this.route.data.pluck('course');
  }

  ngOnInit(): void {

    this.course$.subscribe((course: Course) => {
      this.course = course;
      this.activate();
    });


  }

  activate(): void {

    const grpName = {};
  
    if (this.course.workGroups) {
      this.workGroups = this.workGroupOrig = this.course.workGroups;
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

      this.workGroups.forEach((g, i, array) => {
        grpName[g.groupNumber] = null;
      });

      this.strings = Object.keys(grpName)
        .sort((a: any, b: any) => a - b)
        .map(grpNum => `Flight ${grpNum}`);

      this.filteredStrings = this.strings;

    }
  }

  filterStrings(value: string): void {
    this.filteredStrings = this.strings.filter((item: any) => {
      return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
    }).filter((filteredItem: any) => {
      return this.stringsModel ? this.stringsModel.indexOf(filteredItem) < 0 : true;
    });
  }

  add(value: string): void {

    this.workGroups = this.workGroupOrig.filter(wg => {
      let match = false;

      this.stringsModel.forEach(item => {
        let flight = `Flight ${wg.groupNumber}`;
        if (flight === item) {
          match = true;
        }
      });

      return match;
    });

  }

  remove(value: string): void {

    if (this.stringsModel.length > 0) {
      this.workGroups = this.workGroupOrig.filter(wg => {
        let match = false;

        this.stringsModel.forEach(item => {
          let flight = `Flight ${wg.groupNumber}`;
          if (flight === item) {
            match = true;
          }
        });

        return match;
      });
    } else {
      this.workGroups = this.workGroupOrig;
    }


  }


  // let multiTest = this.multi;
  // this.multi = this.multiOriginal.filter(data => {

  //   let match = false;

  //   this.itemsRequireMatch.forEach(item => {
  //     if (data.name == item) {
  //       match = true;
  //     }

  //   });

  //   return match;
  // });

}
