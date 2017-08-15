import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { TdDialogService } from '@covalent/core';
import { Observable, Observer } from 'rxjs/Rx';

import { AppComponent } from "../../../app/app.component";
import { UserDataContext } from "./data/user-data-context.service";
import { GlobalService } from "./global.service";

@Injectable()
export class UserSaveChangesGuard implements CanDeactivate<AppComponent> {

  constructor(private dialogService: TdDialogService, private userDataContext: UserDataContext, private global: GlobalService) { }

  canDeactivate(appComponent: AppComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): boolean {

    let hasChanges = this.userDataContext.hasChanges();

    if (!this.global.persona.value.person.registrationComplete) {
      return false;
    }

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
          this.userDataContext.rollback();
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
