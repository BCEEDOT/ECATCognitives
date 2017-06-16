import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Course, WorkGroup } from "../../core/entities/faculty";

@Injectable()
export class FacWorkgroupService {

    facWorkGroup$: BehaviorSubject<WorkGroup> = new BehaviorSubject({} as WorkGroup);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    assessComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    checkStrat$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    facWorkGroup(facWorkGroup: WorkGroup) {
        this.facWorkGroup$.next(facWorkGroup);
    }

    isLoading(isLoading: boolean) {
        this.isLoading$.next(isLoading);
    }

    assessComplete(yes: boolean) {
        this.assessComplete$.next(yes);
    }

    checkStrat(yes: boolean) {
        this.checkStrat$.next(yes);
    }




}
