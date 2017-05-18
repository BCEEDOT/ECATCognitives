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
import { SpProviderModule } from "../provider/sp-provider/sp-provider.module";

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
    ],
    exports: [],
    providers: [
        StudentAuthGuard,
        StudentDataContext,
        WorkGroupService
    ]
})

export class StudentModule { }