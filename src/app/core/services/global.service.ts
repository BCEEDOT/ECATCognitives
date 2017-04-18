import { Injectable } from '@angular/core';
import { Person } from "../entities/user";

@Injectable()
export class GlobalService {

  constructor() { }

  private persona: Person;

  set loggedInUser(persona: Person) {
      this.persona = persona;
  }

  get loggedInUser(): Person {
    return this.persona;
  }

}
