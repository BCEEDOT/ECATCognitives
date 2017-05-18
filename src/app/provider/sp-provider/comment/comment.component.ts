import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { SpProviderService } from '../sp-provider.service';
import { Person, StudSpComment } from '../../../core/entities/student';
import { FacSpComment } from '../../../core/entities/faculty';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  private comment: StudSpComment | FacSpComment;
  private recipient: Person;
  private isStudent: boolean;
  private canSave: boolean = false;
  private reqAnon: boolean = false;
  private commentLoad: string = 'CommentLoading';
  private viewOnly: boolean;

  constructor(private spProvider: SpProviderService,
    private router: Router,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService) { }

  ngOnInit() {
    //this.comment = this.spProvider.comment;
    this.recipient = this.comment.recipient.studentProfile.person as Person;
    //this.isStudent = this.spProvider.persona.isStudent;
    
    if (this.isStudent) {
      let studComment = this.comment as StudSpComment;
      this.reqAnon = studComment.requestAnonymity;
    }

    //this.viewOnly = this.spProvider.viewOnly;
  }

  save() {
    if(this.viewOnly){
      this.dialogService.openAlert({
        message: 'Group is not in open status.',
        title: 'Cannot Save',
      });
      return;
    }
    
    if (this.isStudent) {
      let studComment = this.comment as StudSpComment;
      studComment.requestAnonymity = this.reqAnon;
    }
    this.loadingService.register(this.commentLoad);

    this.spProvider.save()
      .then(result => {
        this.loadingService.resolve(this.commentLoad);
        this.router.navigate(['/']);
      })
      .catch(result => {
        this.loadingService.resolve(this.commentLoad);
        this.dialogService.openAlert({
          message: 'Your changes were not saved, please try again.',
          title: 'Save Error',
        });
      })
  }

  cancel() {
    if (this.comment.entityAspect.entityState.isAddedModifiedOrDeleted()){
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed){
          this.comment.entityAspect.rejectChanges();
          this.router.navigate(['/']);
        }
      });
    }
  }

}
