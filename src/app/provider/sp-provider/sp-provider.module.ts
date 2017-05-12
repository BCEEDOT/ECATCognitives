import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessComponent } from './assess/assess.component';
import { CommentComponent } from './comment/comment.component';
import { SpProviderService } from './sp-provider.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AssessComponent, CommentComponent ],
  exports: [ AssessComponent, CommentComponent ],
  providers: [ SpProviderService ]
})
export class SpProviderModule { }
