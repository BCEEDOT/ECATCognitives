import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar } from "@angular/material";
import { TdDialogService, TdLoadingService } from "@covalent/core";
import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup } from "../../../core/entities/faculty";
import { FacWorkgroupService } from "../../services/facworkgroup.service";
import { MpSpStatus } from "../../../core/common/mapStrings";
import { FacultyDataContextService } from "../../services/faculty-data-context.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  membersResults: CrseStudentInGroup[];
  workGroup: WorkGroup;
  workGroup$: Observable<WorkGroup>;
  workGroupName: string;
  paramWorkGroupId: number;
  paramCourseId: number;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facWorkGroupService: FacWorkgroupService,
    private location: Location,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private facultyDataContext: FacultyDataContextService,
    private snackBar: MdSnackBar
  ) { }

  ngOnInit() {

    this.facWorkGroupService.onListView(false);
    this.isLoading = true;

    //this.loadingService.register('isLoading');

    this.route.params.subscribe(params => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.paramCourseId = +params['crsId'];
    });

    this.facultyDataContext.fetchGrpMemsWithSpResults(this.paramCourseId, this.paramWorkGroupId)
      .then((results: CrseStudentInGroup[]) => {
        this.membersResults = results;
        this.isLoading = false;
        this.activate();
        //this.loadingService.resolve('isLoading');
        
      }).catch(error => {
        this.router.navigate(['../../'], { relativeTo: this.route });
        this.dialogService.openAlert({
          message: 'There was an error loading results, please try again.',
          title: 'Load Error',
        });
      });

  }

  activate(): void {
    this.workGroup = this.membersResults[0].workGroup;

    // this.membersResults.forEach(gm => {
    //   gm['hasReceivedChartData'] = gm.resultForStudent.breakOutReceived.some(cd => cd.data > 0);
    //   gm['hasGivenChartData'] = gm.statusOfStudent.gaveBreakOutChartData.some(cd => cd.data > 0);
    // });

    this.workGroupName = (this.workGroup.customName) ? `${this.workGroup.defaultName} ${this.workGroup.customName}` : this.workGroup.defaultName;


  }

  refreshData(){
    this.facultyDataContext.fetchGrpMemsWithSpResults(this.paramCourseId, this.paramWorkGroupId, true)
      .then((results: CrseStudentInGroup[]) => {
        this.membersResults = results;
        this.activate();
      }).catch(error => {
        this.router.navigate(['../../'], { relativeTo: this.route });
        this.dialogService.openAlert({
          message: 'There was an error loading results, please try again.',
          title: 'Load Error',
        });
      });
  }

}
