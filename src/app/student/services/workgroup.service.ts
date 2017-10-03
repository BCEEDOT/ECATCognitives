import { Injectable } from '@angular/core';
import { Course, WorkGroup } from '../../core/entities/student';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WorkGroupService {

    workGroup$: BehaviorSubject<WorkGroup> = new BehaviorSubject({} as WorkGroup);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    assessComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    stratComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    onListView$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    workGroup(workGroup: WorkGroup): void {
        this.workGroup$.next(workGroup);
    }

    isLoading(isLoading: boolean): void {
        this.isLoading$.next(isLoading);
    }

    assessComplete(assessComplete: boolean): void {
        this.assessComplete$.next(assessComplete);
    }

    stratComplete(stratComplete: boolean): void {
        this.stratComplete$.next(stratComplete);
    }

    onListView(onListView: boolean): void {
        this.onListView$.next(onListView);
    }

}
