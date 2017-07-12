import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';

import { Course, CrseStudentInGroup, WorkGroup, WorkGroupModel } from '../../../../core/entities/lmsadmin';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.scss']
})
export class EditGroupDialogComponent implements OnInit {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  workGroup: WorkGroup;

  constructor(public dialogRef: MdDialogRef<EditGroupDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    
    this.workGroup = this.data.workGroup;

    console.log(this.workGroup);

  }

}


