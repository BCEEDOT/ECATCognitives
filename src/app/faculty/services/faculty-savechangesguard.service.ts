import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { TdDialogService } from '@covalent/core';
import { Observable, Observer } from 'rxjs/Rx';

import { FacultyComponent } from "../faculty.component";
import { FacultyDataContextService } from "../services/faculty-data-context.service";

@Injectable()
export class FacultySaveChangesGuard implements CanDeactivate<FacultyComponent> {

  constructor(private dialogService: TdDialogService, private facultyDataContext: FacultyDataContextService) { }

  canDeactivate(facultyComponent: FacultyComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): boolean {

    let hasChanges = this.facultyDataContext.hasChanges();

    if (!hasChanges) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to leave this page?',
        title: 'Unsaved Changes',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.facultyDataContext.rollback();
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });

  }
}
