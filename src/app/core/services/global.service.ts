import { Injectable } from '@angular/core';
import { Person } from "../entities/user";

@Injectable()
export class GlobalService {

  constructor() { }

  persona: Person;
  accessToken: any;

  set loggedInUser(persona: Person) {
      this.persona = persona;
  }

  get loggedInUser(): Person {
    return this.persona;
  }

  set userAccessToken(accessToken: any) {
    this.accessToken = accessToken;
  }

  get userAccessToken(): any {
    return this.accessToken
  }

}
