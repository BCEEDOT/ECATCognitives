import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp } from "breeze-client";

import { EmProviderService } from "../../core/services/em-provider.service";
import { UserDataContext } from "../../core/services/data/user-data-context.service";
import { ProfileStudent, UserRegistrationHelper } from "../../core/entities/user";
import { GlobalService } from "../../core/services/global.service";


@Injectable()
export class ProfileService {

  em: EntityManager;

  constructor(private regHelper: UserRegistrationHelper, private emProvider: EmProviderService, 
  private global: GlobalService, private userDataContext: UserDataContext) {


  }

  // getProfile(): Promise<ProfileStudent> {

  // }

  // saveProfile(formName: string) {
  //   //this.userDataContext.commit()
  // }
}
