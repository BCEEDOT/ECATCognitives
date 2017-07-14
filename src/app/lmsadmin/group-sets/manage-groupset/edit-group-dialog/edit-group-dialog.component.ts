import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';


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

  constructor(private fb: FormBuilder, public dialogRef: MdDialogRef<EditGroupDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.workGroup = this.data.workGroup;
    this.buildForm();

  }

  buildForm(): void {
    this.editGroupForm = this.fb.group({
      'defaultName': [this.workGroup.defaultName, [
        Validators.required,
        Validators.maxLength(50)
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

    this.workGroup.groupMembers.forEach(gm => {
      
    });

    this.workGroup.entityAspect.setDeleted()



    this.dialogRef.close(this.workGroup);
  }



  save(): void {
    this.submitted = true;

    if (this.workGroup.defaultName.toLowerCase() !== this.editGroupForm.value.defaultName.toLowerCase() ||
      this.workGroup.customName.toLowerCase() !== this.editGroupForm.value.defaultName.toLowerCase()) {

      this.workGroup.defaultName = this.editGroupForm.value.defaultName;
      this.workGroup.customName = this.editGroupForm.value.customName;

      this.workGroup['changeDescription'] = `${this.workGroup.defaultName}'s information has been modified`;

    }

    this.dialogRef.close();
  }

  close(): void {

    this.dialogRef.close('You are awesome');
  }

}


