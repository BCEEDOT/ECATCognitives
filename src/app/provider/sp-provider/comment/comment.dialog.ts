import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { SpProviderService } from "../sp-provider.service";
import { Person, StudSpComment } from '../../../core/entities/student';
import { FacSpComment } from '../../../core/entities/faculty';
import { MpSpStatus } from "../../../core/common/mapStrings";
import { GlobalService } from "../../../core/services/global.service";
import { StudentDataContext } from "../../../student/services/student-data-context.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.dialog.html',
  styleUrls: ['./comment.dialog.scss']
})
export class CommentDialog implements OnInit {
  private comment: StudSpComment | FacSpComment;
  private recipient: Person;
  private isStudent: boolean;
  private canSave: boolean = false;
  private commentLoad: string = 'CommentLoading';
  private viewOnly: boolean;

  constructor(private ctx: StudentDataContext,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private global: GlobalService,
    public dialogRef: MdDialogRef<CommentDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.comment = this.data.comment as StudSpComment | FacSpComment;
    this.recipient = this.comment.recipient.studentProfile.person as Person;
    this.isStudent = this.global.persona.value.isStudent;
    this.viewOnly = this.comment.workGroup.mpSpStatus !== MpSpStatus.open;
  }

  save() {
    if (!this.comment.entityAspect.entityState.isAddedModifiedOrDeleted() && !this.comment.flag.entityAspect.entityState.isAddedModifiedOrDeleted()) {
      this.dialogService.openAlert({
        message: 'You have no changes to save.',
        title: 'Cannot Save'
      });
      return;
    }

    if(this.viewOnly){
      this.dialogService.openAlert({
        message: 'Group is not in open status.',
        title: 'Cannot Save',
      });
      return;
    }
    
    this.loadingService.register(this.commentLoad);

    this.ctx.commit()
      .then(result => {
        this.loadingService.resolve(this.commentLoad);
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

  cancel() {
    if (this.comment.entityAspect.entityState.isAddedModifiedOrDeleted() || this.comment.flag.entityAspect.entityState.isAddedModifiedOrDeleted()){
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed){
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
