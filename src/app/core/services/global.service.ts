import { Injectable } from '@angular/core';

import { Person } from "../entities/user";
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  user(user: ILoggedInUser) {
    this.persona.next(user);
  }

  userDataContext(activated) {
    this.userDataContextActivated.next(activated);
  }

}
