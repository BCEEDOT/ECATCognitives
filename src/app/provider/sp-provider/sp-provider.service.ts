import { Injectable } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { BaseDataContext } from '../../shared/services/base-data-context.service';
import { IStudSpInventory, IFacSpInventory } from '../../core/entities/client-models'
import { StudSpComment } from "../../core/entities/student/StudSpComment";
import { FacSpComment } from "../../core/entities/faculty/FacSpComment";
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";
import { Person } from "../../core/entities/user/Person";


interface IAssessContext extends BaseDataContext {
  getSpInventory(courseId: number, workGroupId: number, assesseeId: number): Array<IStudSpInventory | IFacSpInventory>;
  //getSpComment(courseId: number, workGroupId: number, recipientId: number): IStudSpComment | IFacSpComment;
}

@Injectable()
export class SpProviderService {
  inventories: Array<IStudSpInventory | IFacSpInventory>;
  comment: StudSpComment | FacSpComment;
  persona: ILoggedInUser;
  viewOnly: boolean;
  private ctx: IAssessContext;

  constructor(private global: GlobalService, private activeRoute: ActivatedRoute) { }

  loadAssessment(ctx: any, courseId: number, workGroupId: number, assesseeId: number, viewOnly: boolean){
    this.ctx = ctx as IAssessContext;
    //this.inventories = inventories;
    this.persona = this.global.persona.value;
    this.viewOnly = viewOnly;

    this.inventories = this.ctx.getSpInventory(courseId, workGroupId, assesseeId); 
  }

  loadComment(ctx: any, comment: StudSpComment | FacSpComment, viewOnly: boolean) {
    this.ctx = ctx as IAssessContext;
    this.comment = comment;
    this.persona = this.global.persona.value;
    this.viewOnly = viewOnly;
  }

  save(): Promise<any> {
    if (this.viewOnly){

    } else {
      return this.ctx.commit()
      .then((result) => {
        console.log('success');
        return result;
      })
      .catch((result) => {
        console.log('error');
        return result;
      })
    }    
  }
}
