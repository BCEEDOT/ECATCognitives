import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';

import { SpProviderService } from "../sp-provider.service";
import { StudSpComment } from '../../../core/entities/student';
import { FacSpComment } from '../../../core/entities/faculty';
import { MpSpStatus } from "../../../core/common/mapStrings";
import { GlobalService } from "../../../core/services/global.service";
import { StudentDataContext } from "../../../student/services/student-data-context.service";
import { FacultyDataContextService } from "../../../faculty/services/faculty-data-context.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.dialog.html',
  styleUrls: ['./comment.dialog.scss']
})
export class CommentDialog implements OnInit {
  private comment: StudSpComment | FacSpComment;
  private isStudent: boolean;
  private canSave: boolean = false;
  private commentLoad: string = 'CommentLoading';
  private viewOnly: boolean = true;

  constructor(private studentDataContext: StudentDataContext,
    private facultyDataContext: FacultyDataContextService,
    private snackBarService: MdSnackBar,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private global: GlobalService,
    public dialogRef: MdDialogRef<CommentDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.comment = this.data.comment as StudSpComment | FacSpComment;
    this.isStudent = this.global.persona.value.isStudent;

    if (this.isStudent) {
      this.viewOnly = this.comment.workGroup.mpSpStatus !== MpSpStatus.open;
    } else {
      //instructors can still add comments when Under Review
      this.viewOnly = this.comment.workGroup.mpSpStatus !== MpSpStatus.open && this.comment.workGroup.mpSpStatus !== MpSpStatus.underReview;
    }
  }

  save() {
    if (!this.comment.entityAspect.entityState.isAddedModifiedOrDeleted() && !this.comment.flag.entityAspect.entityState.isAddedModifiedOrDeleted()) {
      this.dialogService.openAlert({
        message: 'You have no changes to save.',
        title: 'Cannot Save'
      });
      return;
    }

    if (this.viewOnly) {
      this.dialogService.openAlert({
        message: 'Group is not in open status.',
        title: 'Cannot Save',
      });
      return;
    }

    this.loadingService.register(this.commentLoad);

    

    if (this.isStudent) {

      this.studentDataContext.commit()
        .then(result => {
          this.loadingService.resolve(this.commentLoad);
          this.snackBarService.open("Success, Comment Saved!", 'Dismiss')
          this.dialogRef.close();
        })
        .catch(result => {
          this.loadingService.resolve(this.commentLoad);
          this.dialogService.openAlert({
            message: 'Your changes were not saved, please try again.',
            title: 'Save Error.',
          });
        })
    } else {
      this.facultyDataContext.commit()
        .then(result => {
          this.loadingService.resolve(this.commentLoad);
          this.snackBarService.open("Success, Comment Saved!", 'Dismiss')
          this.dialogRef.close();
        })
        .catch(result => {
          this.loadingService.resolve(this.commentLoad);
          this.dialogService.openAlert({
            message: 'Your changes were not saved, please try again.',
            title: 'Save Error.',
          });
        })
    }
  }

  delete() {
    if (this.comment.entityAspect.entityState.isAdded()){
      this.cancel();
      return;
    }

    this.dialogService.openConfirm({
        message: 'Are you sure you want to delete this comment?',
        title: 'Delete Comment',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.comment.flag.entityAspect.setDeleted();
          this.comment.entityAspect.setDeleted();
          this.save();
        }
      });
  }

  cancel() {
    if (this.comment.entityAspect.entityState.isAddedModifiedOrDeleted() || this.comment.flag.entityAspect.entityState.isAddedModifiedOrDeleted()) {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.comment.flag.entityAspect.rejectChanges();
          this.comment.entityAspect.rejectChanges();
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

}
