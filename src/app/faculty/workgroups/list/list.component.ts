import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService, TdLoadingService, TdMediaService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/pluck';

import { Course, WorkGroup } from '../../../core/entities/faculty';
import { FacultyDataContextService } from '../../services/faculty-data-context.service';
import { FacWorkgroupService } from '../../services/facworkgroup.service';
import { MpSpStatus } from "../../../core/common/mapStrings";


@Component({
  selector: 'qs-app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  workGroups: WorkGroup[];
  workGroupOrig: WorkGroup[];
  strings: string[] = [];

  filteredStrings: string[] = [];
  stringsModel: string[] = [];

  course$: Observable<Course>;
  course: Course;
  isLoading: boolean = true;
  paramCourseId: number;
  statusMap = MpSpStatus;

  options: boolean = false;

  constructor(private route: ActivatedRoute, private loadingService: TdLoadingService,
    private facWorkGroupService: FacWorkgroupService, private facultyDataContext: FacultyDataContextService) {

  }

  ngOnInit(): void {

    this.facWorkGroupService.onListView(true);

    this.route.params.subscribe(params => {
      this.paramCourseId = +params['crsId'];
      this.isLoading = true;

      if (this.paramCourseId) {
        this.facultyDataContext.getActiveCourse(this.paramCourseId).then((course: Course) => {

          this.course = course;
          this.facWorkGroupService.course(course);
          this.activate();
          this.isLoading = false;
        });
      }

    });

  }

  activate(): void {
    this.strings = [];

    if (this.course.workGroups) {
      this.workGroups = this.workGroupOrig = this.course.workGroups.filter(wg => wg.mpSpStatus !== MpSpStatus.created);

      this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
        if (wgA.mpCategory < wgB.mpCategory) return -1;
        if (wgA.mpCategory > wgB.mpCategory) return 1;
        if (+wgA.groupNumber < +wgB.groupNumber) return -1;
        if (+wgA.groupNumber > +wgB.groupNumber) return 1;

        return 0;

      });

      this.workGroups.forEach((wg: WorkGroup) => {
        let statusText = '';
        if (wg.mpSpStatus === MpSpStatus.published) {
          statusText = 'Evaluations'
        } else {
          statusText = 'Evaluate'
        }
        wg['statusText'] = statusText;

        if (!this.strings.find(str => str === wg.defaultName)){
          this.strings.push(wg.defaultName);
        }
      });

      this.strings.sort((a: string, b: string) => {
        if (a < b) {return -1}
        if (a > b) {return 1}
        return 0
      });

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
        //let flight = `Flight ${wg.groupNumber}`;
        if (wg.defaultName === item) {
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
          //let flight = `Flight ${wg.groupNumber}`;
          if (wg.defaultName === item) {
            match = true;
          }
        });

        return match;
      });
    } else {
      this.workGroups = this.workGroupOrig;
    }

  }

}
