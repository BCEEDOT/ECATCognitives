import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/pluck';

import { StudentDataContext } from "../../../student/services/student-data-context.service";
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
  private inventories: Array<IStudSpInventory | IFacSpInventory>;
  private inventories$: Observable<Array<IStudSpInventory | IFacSpInventory>>;
  private isStudent: boolean;
  private isSelf: boolean;
  private perspective: string;
  private activeInventory: IStudSpInventory | IFacSpInventory;
  private canSave: boolean = false;
  private respEnum = {
        he: SpEffectLevel.HighlyEffective,
        e: SpEffectLevel.Effective,
        ie: SpEffectLevel.Ineffective,
        usl: SpFreqLevel.Usually,
        alw: SpFreqLevel.Always
    };
  private assessLoad: string = 'AssessLoading';
  private viewOnly: boolean = true;

  constructor(private ctx: StudentDataContext, //| FacultyDataContext, 
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService,
    private global: GlobalService, 
    private route: ActivatedRoute,
    private location: Location) { 
      this.inventories$ = route.data.pluck('inventories');
    }

  ngOnInit() {
    this.inventories$.subscribe(invs => {
      this.inventories = invs;
    });

    this.inventories.sort((a, b) => {
      if (a.displayOrder < b.displayOrder){ return -1; }
      if (a.displayOrder > b.displayOrder){ return 1; }
      return 0;
    });

    this.isStudent = this.global.persona.value.isStudent;
    this.isSelf = this.inventories[0].responseForAssessee.assessee.studentProfile.person.personId === this.global.persona.value.person.personId;

    if (this.isStudent){
      if (this.isSelf){
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
  
  previousInv(){
    let prev = this.inventories.find(inv => inv.displayOrder === (this.activeInventory.displayOrder - 1));
    this.activeInventory = prev;
    this.saveCheck();
  }

  nextInv(){
    let next = this.inventories.find(inv => inv.displayOrder === (this.activeInventory.displayOrder + 1));
    this.activeInventory = next;
    this.saveCheck();
  }

  saveCheck(){
    if (!this.viewOnly){
      let changes = this.inventories.some(inv => inv.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted());
      let validResps = this.inventories.every(inv => inv.responseForAssessee.mpItemResponse !== null);

      if (changes && validResps){
        this.canSave = true;
      } else {
        this.canSave = false;
      }
    }
  }

  cancel(){
    if (this.inventories.some(inv => inv.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted())){
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed){
          this.inventories.forEach(inv => inv.responseForAssessee.entityAspect.rejectChanges());
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }

  save(){
    if (this.viewOnly){
      this.dialogService.openAlert({
        message: 'Group is not in open status',
        title: 'Cannot Save',
      });
      return;
    }

    this.loadingService.register(this.assessLoad);
    this.ctx.commit()
      .then(result => {
        this.loadingService.resolve(this.assessLoad);
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
      if (inv.behavior.length > 35){
        return inv.behavior.substring(0, 32) + '...';
      } else {
        return inv.behavior;
      }
    }

}
