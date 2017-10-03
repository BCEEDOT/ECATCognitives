import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TdDialogService } from "@covalent/core";

import { MpGroupCategory } from '../../../../core/common/mapStrings';
import { Course, CrseStudentInGroup, WorkGroup, WorkGroupModel } from '../../../../core/entities/lmsadmin';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.scss']
})
export class EditGroupDialogComponent implements OnInit {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  editGroupForm: FormGroup
  workGroup: WorkGroup;
  submitted: boolean = false;
  numbers: string[] = [];
  flightNumber: string;
  canDelete: boolean = false;

  constructor(private fb: FormBuilder, private dialogService: TdDialogService,
    public dialogRef: MdDialogRef<EditGroupDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.workGroup = this.data.workGroup;

    if (this.workGroup.mpCategory !== MpGroupCategory.bc1 ) {
      this.canDelete = true;
    }

    for (var i = 1; i <= 30; i++) {

      if (i < 10) {
        this.numbers.push(`0${i}`);
      } else {
        this.numbers.push(i.toString());
      }
    }

    this.buildForm();

  }

  buildForm(): void {
    this.editGroupForm = this.fb.group({
      'groupNumber': [this.workGroup.groupNumber, [
        Validators.required
      ]
      ],
      'customName': [this.workGroup.customName, [
        Validators.maxLength(50)
      ]
      ]
    });

    //this.editGroupForm.valueChanges.subscribe(data => console.log(data));

  }

  isDisabled(): boolean {
    if (this.editGroupForm.dirty) {
      if (this.editGroupForm.valid) {
        return false;
      }
      return true;
    }

    return true;
  }

  delete(): void {

    if (this.workGroup.groupMembers.length === 0) {
      this.dialogRef.close(this.workGroup);
    } else {

      this.dialogService.openConfirm({
        message: 'Are you sure you want to delete this flight? All students will be placed in unassigned.',
        title: 'Delete Flight',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.workGroup['toDelete'] = true;
          this.dialogRef.close(this.workGroup);
        }
      });
    }

  }



  ok(): void {
    this.submitted = true;

    if (this.workGroup.groupNumber !== this.editGroupForm.value.groupNumber ||
      (this.workGroup.customName === null && this.editGroupForm.value.customName !== null) || (this.workGroup.customName !== null && this.editGroupForm.value.customName === null) || this.workGroup.customName.toLowerCase() !== this.editGroupForm.value.customName.toLowerCase()) {

      this.workGroup.groupNumber = this.editGroupForm.value.groupNumber;
      this.workGroup.defaultName = `Flight ${this.editGroupForm.value.groupNumber}`;
      this.workGroup.customName = this.editGroupForm.value.customName;

      if ((<any>this.workGroup.entityAspect.originalValues).defaultName) {
        this.workGroup['changeDescription'] = `${(<any>this.workGroup.entityAspect.originalValues).defaultName}'s information has been modified`;
      } else {
        if (!this.workGroup.entityAspect.entityState.isAdded()) {
          this.workGroup['changeDescription'] = `${this.workGroup.defaultName}'s information has been modified`;
        }
      }

    }

    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

}


