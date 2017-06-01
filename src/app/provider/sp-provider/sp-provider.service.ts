import { Injectable } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

// import { BaseDataContext } from '../../shared/services/base-data-context.service';
// import { IStudSpInventory, IFacSpInventory } from '../../core/entities/client-models'
import { StudSpComment, CrseStudentInGroup } from "../../core/entities/student";
import { FacSpComment } from "../../core/entities/faculty/FacSpComment";
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";
import { Person } from "../../core/entities/user/Person";
import { StudentDataContext } from "../../student/services/student-data-context.service";
import { CommentDialog } from "./comment/comment.dialog";

@Injectable()
export class SpProviderService {
  dialogRef: MdDialogRef<CommentDialog>;

  constructor(private ctx: StudentDataContext,
  private dialog: MdDialog) { }

  loadComment(recipient: CrseStudentInGroup) {
    let comment = this.ctx.getComment(recipient.courseId, recipient.workGroupId, recipient.studentId);

    this.dialogRef = this.dialog.open(CommentDialog, {
      disableClose: true,
      //hasBackdrop: true,
      data: {
        comment: comment,
      }
    });
  }

  // save(): Promise<any> {
  //   return this.ctx.commit()
  //     .then((result) => {
  //       console.log('success');
  //       return result;
  //     })
  //     .catch((result) => {
  //       console.log('error');
  //       return result;
  //     })
  // }    
}
