import { Component, OnInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TdDialogService } from "@covalent/core";
import { CrseStudentInGroup } from "../../../../core/entities/lmsadmin/index";

@Component({
  selector: 'app-move-student-dialog',
  templateUrl: './move-student-dialog.component.html',
  styleUrls: ['./move-student-dialog.component.scss']
})
export class MoveStudentDialogComponent implements OnInit {
  @ViewChild(TemplateRef) template: TemplateRef<any>;

  student: CrseStudentInGroup;
  fromUnassigned: boolean = false;
  fromNum: string;
  flightNums: Array<string> = [];
  selFlight: string = '';
  unassign: boolean = false;

  constructor(private dialogService: TdDialogService, public dialogRef: MdDialogRef<MoveStudentDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.student = this.data.student;
    this.fromUnassigned = this.data.fromUnassigned;
    if (!this.fromUnassigned) {
      this.fromNum = this.student.workGroup.groupNumber;
    }
    this.flightNums = this.data.flights;
  }

  ok() {
    let move = {
      unassign: false,
      toFlight: ""
    }

    move.unassign = this.unassign;
    move.toFlight = this.selFlight;

    this.dialogRef.close(move);
  }

  close(){
    this.dialogRef.close();
  }

}
