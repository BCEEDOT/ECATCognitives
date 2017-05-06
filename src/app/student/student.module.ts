import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { StudentComponent } from "./student.component";
import { StudentRoutingModule } from "./student-routing.module";
import { StudentAuthGuard } from "./services/student-auth-guard.service";
import { StudentDataContext } from "./services/student-data-context.service";
import { EntityStudentModule } from "../core/entities/student";
import { AssessComponent } from './shared/assess/assess.component';
import { StratComponent } from './list/strat/strat.component';
import { CoursesComponent } from './shared/courses/courses.component';
import { CourseComponent } from './shared/course/course.component';
import { WorkgroupsComponent } from './shared/workgroups/workgroups.component';
import { WorkgroupComponent } from './shared/workgroup/workgroup.component';
import { ListComponent } from './list/list.component';
import { ResultsComponent } from './results/results.component';

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
        CoursesComponent,
        CourseComponent,
        WorkgroupsComponent,
        WorkgroupComponent,
        ListComponent,
        ResultsComponent,
    ],
    exports: [],
    providers: [
        StudentAuthGuard,
        StudentDataContext
    ]
})

export class StudentModule { }