import { Injectable } from '@angular/core';

import { Person } from "../entities/user";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class GlobalService {

  private loggedInUser = new Subject<Person>();
  private loggedIn = new Subject<Boolean>();
  private student = new Subject<Boolean>();
  private faculty = new Subject<Boolean>();
  private lmsAdmin = new Subject<Boolean>();
  private profileComplete = new Subject<Boolean>();

  user$ = this.loggedInUser.asObservable();
  isStudent$ = this.student.asObservable();
  isFaculty$ = this.faculty.asObservable();
  isLMSAdmin$ = this.lmsAdmin.asObservable();
  isLoggedIn$ = this.loggedIn.asObservable();
  isProfileComplete$ = this.profileComplete.asObservable();

  user(loggedInUser: Person) {
    this.loggedInUser.next(loggedInUser);
  }

  isLoggedIn(isLoggedIn: Boolean) {
    this.loggedIn.next(isLoggedIn);
  }

  isStudent(isStudent: Boolean) {
    this.student.next(isStudent);
  }

  isFaculty(isFaculty: Boolean) {
    this.faculty.next(isFaculty);
  }

  isLmsAdmin(isLmsAdmin: Boolean) {
    this.lmsAdmin.next(isLmsAdmin);
  }

  isProfileComplete(isProfileComplete: Boolean) {
    this.profileComplete.next(isProfileComplete);
  }

}
