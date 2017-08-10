import { Injectable } from '@angular/core';

import { Person } from "../entities/user";
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TimerObservable } from 'rxjs/observable/TimerObservable'
import { TdDialogService } from "@covalent/core";

export interface ILoggedInUser {
  person: Person,
  isLoggedIn: boolean,
  isStudent: boolean,
  isFaculty: boolean,
  isLmsAdmin: boolean,
}

@Injectable()
export class GlobalService {

  userDataContextActivated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  persona: BehaviorSubject<ILoggedInUser> = new BehaviorSubject({} as ILoggedInUser);

  constructor(private dialogService: TdDialogService) {}

  user(user: ILoggedInUser) {
    this.persona.next(user);
  }

  userDataContext(activated) {
    this.userDataContextActivated.next(activated);
  }

  startTokenTimer(time: number){
    if (time < 0) {
      this.dialogService.openAlert({message: 'Your login token expires in less than 5 minutes. Please save your work and close and relaunch ECAT to receive a new token.', title: 'Token Expiration', closeButton: 'Ok'});
    } else {
      let timer = new TimerObservable(time);
      timer.subscribe(_ => {
        this.dialogService.openAlert({message: 'Your login token will expire in 5 minutes. Please save your work and close and relaunch ECAT to receive a new token.', title: 'Token Expiration', closeButton: 'Ok'})
      });
    }
  }

}
