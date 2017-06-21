import { Injectable } from '@angular/core';
import { Course, WorkGroup } from "../../core/entities/student";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WorkGroupService {

    workGroup$: BehaviorSubject<WorkGroup> = new BehaviorSubject({} as WorkGroup);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    workGroup(workGroup: WorkGroup) {
        this.workGroup$.next(workGroup);
    }

    isLoading(isLoading: boolean) {
        this.isLoading$.next(isLoading);
    }

}
