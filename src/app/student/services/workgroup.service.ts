import { Injectable } from '@angular/core';
import { Course, WorkGroup } from "../../core/entities/student";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WorkGroupService {

    constructor() {
        console.log('It is creating a new workgroupservice');
    }

    workGroup$: BehaviorSubject<WorkGroup> = new BehaviorSubject({} as WorkGroup);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    assessComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    stratComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    workGroup(workGroup: WorkGroup) {
        this.workGroup$.next(workGroup);
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

}
