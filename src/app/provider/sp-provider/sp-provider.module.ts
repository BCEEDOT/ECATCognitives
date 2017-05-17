import { NgModule } from '@angular/core';

import { SharedModule } from "../../shared/shared.module";
import { AssessComponent } from './assess/assess.component';
import { CommentComponent } from './comment/comment.component';
import { SpProviderService } from './sp-provider.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ AssessComponent, CommentComponent ],
  exports: [ AssessComponent, CommentComponent ],
  providers: [ SpProviderService ]
})
export class SpProviderModule { }
