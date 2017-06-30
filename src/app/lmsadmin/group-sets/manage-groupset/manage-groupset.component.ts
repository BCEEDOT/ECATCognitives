import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MdSnackBar } from "@angular/material";
import { TdDialogService } from "@covalent/core";

import { LmsadminWorkgroupService } from "../../services/lmsadmin-workgroup.service";
import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";
import { WorkGroupModel, Course, WorkGroup } from "../../../core/entities/lmsadmin";
import { MpSpStatus, MpGroupCategory } from "../../../core/common/mapStrings";

@Component({
  selector: 'app-manage-groupset',
  templateUrl: './manage-groupset.component.html',
  styleUrls: ['./manage-groupset.component.scss']
})
export class ManageGroupsetComponent implements OnInit {

  workGroups: WorkGroup[];
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  disabled = false;
  allExpanded: boolean = false;

  constructor(private lmsadminDataContext: LmsadminDataContextService,
    private lmsadminWorkGroupService: LmsadminWorkgroupService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let workGroupCategory: string = params['catId'];
      this.workGroups = this.lmsadminWorkGroupService.workGroupModels$.value.filter(workGroup => workGroup.mpWgCategory === workGroupCategory)[0].workGroups;
      this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
        if (+wgA.groupNumber < +wgB.groupNumber) return -1;
        if (+wgA.groupNumber > +wgB.groupNumber) return 1;
      return 0;
    });

    this.workGroups.forEach(workGroup => {
      workGroup['isExpanded'] = false;
    })
      this.activate();
    });
    
  }

  activate(): void {
    
  }

  expandOrCollapseAll() {
    if (this.allExpanded) {
      this.workGroups.forEach(workGroup => {
        workGroup['isExpanded'] = true; 
      });
    } else {
      this.workGroups.forEach(workGroup => {
        workGroup['isExpanded'] = false; 
      });
    }
  }

}
