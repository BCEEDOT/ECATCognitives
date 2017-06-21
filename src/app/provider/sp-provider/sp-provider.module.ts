import { NgModule } from '@angular/core';

import { SharedModule } from "../../shared/shared.module";
import { AssessComponent } from './assess/assess.component';
import { CommentDialog } from './comment/comment.dialog';
import { SpProviderService } from './sp-provider.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ AssessComponent, CommentDialog ],
  exports: [ AssessComponent ],
  providers: [ SpProviderService ],
  entryComponents: [ CommentDialog ]
})
export class SpProviderModule { }
