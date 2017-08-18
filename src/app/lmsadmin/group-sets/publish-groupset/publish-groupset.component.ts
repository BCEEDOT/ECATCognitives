import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MdSnackBar } from "@angular/material";

import { TdLoadingService, TdDialogService } from "@covalent/core";

import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";
import { LmsadminWorkgroupService } from "../../services/lmsadmin-workgroup.service";
import { WorkGroupModel, WorkGroup } from "../../../core/entities/lmsadmin/index";
import { MpSpStatus } from "../../../core/common/mapStrings";

@Component({
  selector: 'app-publish-groupset',
  templateUrl: './publish-groupset.component.html',
  styleUrls: ['./publish-groupset.component.scss']
})
export class PublishGroupsetComponent implements OnInit {
  models: Array<WorkGroupModel> = [];
  model: WorkGroupModel;
  wgCat: string;
  courseId: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private loadingService: TdLoadingService,
    private lmsadminDataService: LmsadminDataContextService,
    private lmsadminWorkGroupService: LmsadminWorkgroupService,
    private dialogService: TdDialogService,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.wgCat = params['catId'];
      this.courseId = params['crsId'];
      this.models = this.lmsadminWorkGroupService.workGroupModels$.value;
      this.activate();
    });
  }

  activate() {
    this.loadingService.register();
    this.model = this.models.filter(mdl => mdl.mpWgCategory === this.wgCat)[0];
    this.lmsadminDataService.fetchAllGroupSetMembers(this.courseId, this.wgCat).then(res => {
      this.model.workGroups.sort((a: WorkGroup, b: WorkGroup) => {
        if (a.groupNumber < b.groupNumber) {return -1}
        if (a.groupNumber > b.groupNumber) {return 1}
        return 0;
      })
      this.loadingService.resolve();
    })
  }

  publish(){
    this.loadingService.register();
    let toPublish: Array<WorkGroup> = [];
    this.model.workGroups.forEach(grp => {
      if (!grp.groupMembers.some(mem => !mem.isDeleted) || grp.mpSpStatus === MpSpStatus.reviewed)
      { 
        toPublish.push(grp);
      }
    });

    if (toPublish.length > 0) {
      this.dialogService.openConfirm({message: 'This will calculate group results and publish them to students for all groups in Reviewed status and mark groups with no members as Published. ' + toPublish.length + ' group(s) will be Published. This action is final and cannot be undone. Are you sure you want to Publish?', title: 'Publish Groups', acceptButton: 'Yes', cancelButton:'No'}).afterClosed().subscribe((confirmed) => {
        if (confirmed){
          toPublish.forEach(grp => grp.mpSpStatus = MpSpStatus.published);
          this.lmsadminDataService.commit().then((fulfilled) => {
            this.snackBar.open(toPublish.length + ' Group(s) Published!', 'Dismiss', {duration: 2000});
            this.loadingService.resolve();
            this.activate();
          }, (rejected) => {
            this.loadingService.resolve();
            this.activate();
            this.dialogService.openAlert({message: 'There was a problem publishing the groups on the server. Check all groups\' Evaluate screens to ensure their review data was properly saved.', title: 'Publishing Error'});
          }).catch((e: Event) => {
            this.loadingService.resolve();
            this.activate();
            this.dialogService.openAlert({message: 'An error occured while trying to publish these groups. Please try again.', title: 'Publishing Error'});
          });
        } else {
          this.loadingService.resolve();
        }
      });
    } else {
      this.dialogService.openAlert({message: 'There are no groups in Reviewed status or without members.', title: 'No Publishable Groups'});
      this.loadingService.resolve();
    }
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}
