import { Component, OnInit } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Course, CrseStudentInGroup, WorkGroup, SpResult } from '../../core/entities/student';
import { WorkGroupService } from '../services/workgroup.service';
import { GlobalService } from '../../core/services/global.service';
import { SpProviderService } from '../../provider/sp-provider/sp-provider.service';
import { StudentDataContext } from '../services/student-data-context.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  workGroup: WorkGroup;
  paramWorkGroupId: number;
  paramCourseId: number;
  isLoading: boolean = false;
  memberResults: SpResult;
  change: number = 1;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService, private route: ActivatedRoute,
    private studentDataContext: StudentDataContext, private dialogService: TdDialogService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar, private spProvider: SpProviderService) {

    this.route.params.subscribe((params: any) => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.activate();
    });

  }

  ngOnInit(): void {
    // this.activate();
  }

  activate(): void {

    this.change++;
    this.isLoading = true;
    this.workGroupService.onListView(true);

    this.studentDataContext.fetchWgResult(this.paramWorkGroupId)
      .then((results: SpResult) => {
        this.memberResults = results;
        this.workGroup = this.memberResults.workGroup;
        this.isLoading = false;
      }).catch((error: Event) => {
        this.dialogService.openAlert({
          message: 'There was an error loading your results, please try again.',
          title: 'Load Error',
        });
      });
  }

}
