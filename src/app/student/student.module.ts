import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { StudentComponent } from "./student.component";
import { StudentRoutingModule } from "./student-routing.module";
import { StudentAuthGuard } from "./services/student-auth-guard.service";
import { StudentDataContext } from "./services/student-data-context.service";
import { EntityStudentModule } from "../core/entities/student";
import { AssessComponent } from './assess/assess.component';
import { StratComponent } from './strat/strat.component';

@NgModule({
    imports: [
        StudentRoutingModule,
        SharedModule,
        EntityStudentModule
    ],
    declarations: [
        StudentComponent,
        AssessComponent,
        StratComponent,
    ],
    exports: [],
    providers: [
        StudentAuthGuard,
        StudentDataContext
    ]
})

export class StudentModule { }