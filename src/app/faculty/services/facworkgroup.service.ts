import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Course, WorkGroup } from "../../core/entities/faculty";

@Injectable()
export class FacWorkgroupService {

    facWorkGroup$: BehaviorSubject<WorkGroup> = new BehaviorSubject({} as WorkGroup);
    course$: BehaviorSubject<Course> = new BehaviorSubject({} as Course);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    assessComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    stratComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    commentsComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    onListView$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    readOnly$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    facWorkGroup(facWorkGroup: WorkGroup) {
        this.facWorkGroup$.next(facWorkGroup);
    }

    course(course: Course) {
        this.course$.next(course);
    }

    isLoading(isLoading: boolean) {
        this.isLoading$.next(isLoading);
    }

    assessComplete(assessComplete: boolean){
        this.assessComplete$.next(assessComplete);
    }

    stratComplete(stratComplete: boolean){
        this.stratComplete$.next(stratComplete);
    }

    commentsComplete(commentsComplete: boolean){
        this.commentsComplete$.next(commentsComplete);
    }

    onListView(onListView: boolean) {
        this.onListView$.next(onListView);
    }

    readOnly(readOnly: boolean) {
        this.readOnly$.next(readOnly);
    }

}
