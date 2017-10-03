import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { StudentComponent } from "./student.component";
import { StudentRoutingModule } from "./student-routing.module";
import { StudentAuthGuard } from "./services/student-auth-guard.service";
import { StudentDataContext } from "./services/student-data-context.service";
import { EntityStudentModule } from "../core/entities/student";
import { StratComponent } from './list/strat/strat.component';
import { ListComponent } from './list/list.component';
import { ResultsComponent } from './results/results.component';
import { AssessComponent } from './shared/assess/assess.component';
import { WorkGroupService } from "./services/workgroup.service";
import { AssessCompareDialog } from './shared/assess-compare/assess-compare.dialog';
import { SpProviderModule } from "../provider/sp-provider/sp-provider.module";
import { BehaviorsComponent } from './results/behaviors/behaviors.component';
import { CommentsComponent } from './results/comments/comments.component';
import { RouteBackComponent } from './shared/route-back/route-back.component';

@NgModule({
    imports: [
        StudentRoutingModule,
        SharedModule,
        EntityStudentModule,
        SpProviderModule
    ],
    declarations: [
        StudentComponent,
        StratComponent,
        ListComponent,
        ResultsComponent,
        AssessComponent,
        AssessCompareDialog,
        BehaviorsComponent,
        CommentsComponent,
        RouteBackComponent,
    ],
    exports: [],
    providers: [
        StudentAuthGuard,
        StudentDataContext,
        WorkGroupService,
    ],
    entryComponents: [
        AssessCompareDialog
    ]
})

export class StudentModule { }