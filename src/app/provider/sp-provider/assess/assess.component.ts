import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { SpProviderService } from '../sp-provider.service';
import { Person } from '../../../core/entities/student';
import { IStudSpInventory, IFacSpInventory } from '../../../core/entities/client-models'
import { MpSpItemResponse } from '../../../core/common/mapStrings'
import { SpEffectLevel, SpFreqLevel } from '../../../core/common/mapEnum'

@Component({
  selector: 'app-assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})

export class AssessComponent implements OnInit {
  private inventories: Array<IStudSpInventory | IFacSpInventory>;
  private isStudent: boolean;
  private isSelf: boolean;
  private perspective: string;
  private assessee: Person;
  private activeInventory: IStudSpInventory | IFacSpInventory;
  private canSave: boolean = false;
  private respEnum = {
        he: SpEffectLevel.HighlyEffective,
        e: SpEffectLevel.Effective,
        ie: SpEffectLevel.Ineffective,
        usl: SpFreqLevel.Usually,
        alw: SpFreqLevel.Always
    };

  constructor(private spProvider: SpProviderService, 
    private router: Router,
    private dialogService: TdDialogService) { }

  ngOnInit() {
    this.inventories = this.spProvider.inventories;
    this.inventories.sort((a, b) => {
      if (a.displayOrder < b.displayOrder){ return 1; }
      if (a.displayOrder > b.displayOrder){ return -1; }
      return 0;
    });

    this.isStudent = this.spProvider.persona.isStudent.valueOf();
    this.inventories[0].responseForAssessee
    this.assessee = this.inventories[0].responseForAssessee.assessee.studentProfile.person as Person;
    this.isSelf = this.assessee.personId === this.spProvider.persona.person.personId;

    if (this.isStudent){
      if (this.isSelf){
        this.perspective = 'were you';
      } else {
        this.perspective = 'was your peer';
      }
    } else {
      this.perspective = 'was your student';
    }
  }
  
  previousInv(){
    this.activeInventory = this.inventories.find(inv => inv.displayOrder === this.activeInventory.displayOrder - 1);
    this.saveCheck();
  }

  nextInv(){
    this.activeInventory = this.inventories.find(inv => inv.displayOrder === this.activeInventory.displayOrder + 1);
    this.saveCheck();
  }

  saveCheck(){
    if (this.inventories.some(inv => inv.responseForAssessee.itemModelScore === null)){
      this.canSave = false;
    } else {
      this.canSave = true;
    }
  }

  cancel(){
    if (this.inventories.some(inv => inv.entityAspect.entityState.isAddedModifiedOrDeleted())){
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed){
          
        } else {

        }
      });
    }
  }

  save(){
    this.spProvider.save()
      .then(result => {
        this.router.navigate(['/']);
      })
      .catch(result => {
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
      if (inv.behavior.length > 30){
        return inv.behavior.substring(0, 27) + '...';
      } else {
        return inv.behavior;
      }
    }

}
