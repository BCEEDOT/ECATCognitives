import { Injectable } from '@angular/core';

import { Person } from "../entities/user";
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface ILoggedInUser {
  person: Person,
  isLoggedIn: Boolean,
  isStudent: Boolean,
  isFaculty: Boolean,
  isLmsAdmin: Boolean,
}

@Injectable()
export class GlobalService {

  userDataContextActivated: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  persona: BehaviorSubject<ILoggedInUser> = new BehaviorSubject({} as ILoggedInUser);

  user(user: ILoggedInUser) {
    this.persona.next(user);
  }

  userDataContext(activated) {
    this.userDataContextActivated.next(activated);
  }

}
