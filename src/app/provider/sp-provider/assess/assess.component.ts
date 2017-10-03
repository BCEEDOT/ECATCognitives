import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/pluck';

import { StudentDataContext } from "../../../student/services/student-data-context.service";
import { FacultyDataContextService } from "../../../faculty/services/faculty-data-context.service";
import { IStudSpInventory, IFacSpInventory } from '../../../core/entities/client-models'
import { MpSpItemResponse, MpSpStatus } from '../../../core/common/mapStrings'
import { SpEffectLevel, SpFreqLevel } from '../../../core/common/mapEnum'
import { GlobalService } from "../../../core/services/global.service";

@Component({
  selector: 'app-assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})

export class AssessComponent implements OnInit {
  inventories: Array<IStudSpInventory | IFacSpInventory>;
  inventories$: Observable<Array<IStudSpInventory | IFacSpInventory>>;
  isStudent: boolean;
  isSelf: boolean;
  perspective: string;
  activeInventory: IStudSpInventory | IFacSpInventory;
  canSave: boolean = false;
  respEnum = {
    he: SpEffectLevel.HighlyEffective,
    e: SpEffectLevel.Effective,
    ie: SpEffectLevel.Ineffective,
    usl: SpFreqLevel.Usually,
    alw: SpFreqLevel.Always
  };
  assessLoad: string = 'AssessLoading';
  viewOnly: boolean = true;

  constructor(private studentDataContext: StudentDataContext,
    private facultyDataContext: FacultyDataContextService,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService,
    private global: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: MdSnackBar,
    private location: Location) {

    this.inventories$ = route.data.pluck('inventories');

  }

  ngOnInit() {
    this.inventories$.subscribe(invs => {
      this.inventories = invs;
      console.log(this.inventories);
    });

    this.inventories.sort((a, b) => {
      if (a.displayOrder < b.displayOrder) { return -1; }
      if (a.displayOrder > b.displayOrder) { return 1; }
      return 0;
    });

    this.isStudent = this.global.persona.value.isStudent;
    this.isSelf = this.inventories[0].responseForAssessee.assessee.studentProfile.person.personId === this.global.persona.value.person.personId;

    if (this.isStudent) {
      if (this.isSelf) {
        this.perspective = 'were you';
      } else {
        this.perspective = 'was your peer';
      }
    } else {
      this.perspective = 'was your student';
    }

    this.activeInventory = this.inventories[0];

    if (this.isStudent) {
      this.viewOnly = this.activeInventory.responseForAssessee.workGroup.mpSpStatus !== MpSpStatus.open;
    } else {
      //instructors can still add assessments when Under Review
      this.viewOnly = this.activeInventory.responseForAssessee.workGroup.mpSpStatus !== MpSpStatus.open && this.activeInventory.responseForAssessee.workGroup.mpSpStatus !== MpSpStatus.underReview;
    }
  }

  onLeftArrow(event: Event) {
    this.previousInv();
  }

  onRightArrow(event: Event) {
    this.nextInv();
  }

  previousInv() {
    let prev = this.inventories.find(inv => inv.displayOrder === (this.activeInventory.displayOrder - 1));
    if (!prev) {
      let length = this.inventories.length;
      this.activeInventory = this.inventories[length - 1];
    } else {
      this.activeInventory = prev;
    }
    this.saveCheck();

  }

  nextInv() {
    let next = this.inventories.find(inv => inv.displayOrder === (this.activeInventory.displayOrder + 1));
    if (!next) {
      this.activeInventory = this.inventories[0];
    } else {
      this.activeInventory = next;
    }
    this.saveCheck();
  }

  saveCheck() {
    if (!this.viewOnly) {
      let changes = this.inventories.some(inv => inv.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted());
      let validResps = this.inventories.every(inv => inv.responseForAssessee.mpItemResponse !== null);

      if (changes && validResps) {
        this.canSave = true;
      } else {
        this.canSave = false;
      }
    }
  }

  cancel() {

    if (!this.inventories.some(inv => inv.behaviorEffect !== null || inv.behaviorFreq !== null)) {
      this.inventories.forEach(inv => inv.rejectChanges());
      this.router.navigate(['../../'], { relativeTo: this.route })
    }


    if (this.inventories.some(inv => inv.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted())) {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.inventories.forEach(inv => inv.rejectChanges());
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }

  save() {
    if (this.viewOnly) {
      this.dialogService.openAlert({
        message: 'Group is not in open status',
        title: 'Cannot Save',
      });
      return;
    }

    this.loadingService.register(this.assessLoad);
    if (this.isStudent) {
      this.studentDataContext.commit()
        .then(result => {
          this.loadingService.resolve(this.assessLoad);
          this.snackBarService.open("Success, Asessment Saved!", 'Dismiss', { duration: 2000 })
          this.location.back();
        })
        .catch(result => {
          this.loadingService.resolve(this.assessLoad);
          this.dialogService.openAlert({
            message: 'Your changes were not saved, please try again.',
            title: 'Save Error',
          });
        })
    } else {
      this.facultyDataContext.commit()
        .then(result => {
          this.loadingService.resolve(this.assessLoad);
          this.snackBarService.open("Success, Asessment Saved!", 'Dismiss', { duration: 2000 })
          this.location.back();
        })
        .catch(result => {
          this.loadingService.resolve(this.assessLoad);
          this.dialogService.openAlert({
            message: 'Your changes were not saved, please try again.',
            title: 'Save Error',
          });
        })
    }
  }

  getResponseString(inv: IStudSpInventory | IFacSpInventory): string {
    switch (inv.responseForAssessee.mpItemResponse) {
      case MpSpItemResponse.iea:
        return 'Always Ineffective';
      case MpSpItemResponse.ieu:
        return 'Usually Ineffective';
      case MpSpItemResponse.nd:
        return 'Not Displayed';
      case MpSpItemResponse.eu:
        return 'Usually Effective';
      case MpSpItemResponse.ea:
        return 'Always Effective';
      case MpSpItemResponse.heu:
        return 'Usually Highly Effective';
      case MpSpItemResponse.hea:
        return 'Always Highly Effective';
      default:
        return '';
    }
  }

  getShortBehavior(inv: IStudSpInventory | IFacSpInventory): string {
    if (inv.behavior.length > 35) {
      return inv.behavior.substring(0, 32) + '...';
    } else {
      return inv.behavior;
    }
  }

}
