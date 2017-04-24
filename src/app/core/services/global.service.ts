import { Injectable } from '@angular/core';

import { Person } from "../entities/user";
import { IPerson } from "../entities/client-models";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class GlobalService {

  private loggedInUser = new Subject<IPerson>();

  user$ = this.loggedInUser.asObservable();

  user(loggedInUser: IPerson) {
    this.loggedInUser.next(loggedInUser);
  }

}
