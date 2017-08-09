import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TdDialogService } from "@covalent/core";

import { Course, CrseStudentInGroup, WorkGroup, WorkGroupModel } from '../../../../core/entities/lmsadmin';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.scss']
})
export class AddGroupDialogComponent implements OnInit {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  editGroupForm: FormGroup
  workGroup: WorkGroup;
  submitted: boolean = false;
  numbers: string[] = [];
  flightNumber: string;

  constructor(private fb: FormBuilder, private dialogService: TdDialogService,
    public dialogRef: MdDialogRef<AddGroupDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.workGroup = this.data.workGroup;
    let usedFlightNumbers = this.data.usedFlightNumbers;

    for (var i = 1; i <= 30; i++) {

      if (i < 10) {
        this.numbers.push(`0${i}`);
      } else {
        this.numbers.push(i.toString());
      }
    }

    this.numbers = this.numbers.filter(number => !usedFlightNumbers.some(usfn => usfn === number));
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

  ok(): void {
    this.submitted = true;

    if (this.workGroup.groupNumber !== this.editGroupForm.value.groupNumber ||
      this.workGroup.customName.toLowerCase() !== this.editGroupForm.value.customName.toLowerCase()) {

      this.workGroup.groupNumber = this.editGroupForm.value.groupNumber;
      this.workGroup.defaultName = `Flight ${this.editGroupForm.value.groupNumber}`;
      this.workGroup.customName = this.editGroupForm.value.customName;

      if (this.workGroup.entityAspect.originalValues.defaultName) {
        this.workGroup['changeDescription'] = `${this.workGroup.entityAspect.originalValues.defaultName}'s information has been modified`;
      } else {
        this.workGroup['changeDescription'] = `${this.workGroup.defaultName}'s information has been modified`;
      }

      

    }

    this.dialogRef.close(this.workGroup);
  }

  close(): void {
    this.workGroup.entityAspect.rejectChanges();
    this.dialogRef.close();
  }

}
