import { Injectable } from '@angular/core';

import { BaseDataContext } from '../../shared/services/base-data-context.service';
import { IStudSpInventory, IFacSpInventory } from '../../core/entities/client-models'
import { StudSpComment } from "../../core/entities/student/StudSpComment";
import { FacSpComment } from "../../core/entities/faculty/FacSpComment";
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";
import { Person } from "../../core/entities/user/Person";

@Injectable()
export class SpProviderService {
  inventories: Array<IStudSpInventory | IFacSpInventory>;
  comment: StudSpComment | FacSpComment;
  persona: ILoggedInUser;
  private ctx: BaseDataContext;

  constructor(private global: GlobalService) { }

  loadAssessment(ctx: BaseDataContext, inventories: Array<IStudSpInventory | IFacSpInventory>){
    this.ctx = ctx;
    this.inventories = inventories;
  }

  loadComment(ctx: BaseDataContext, comment: StudSpComment | FacSpComment) {
    this.ctx = ctx;
    this.comment = comment;
    this.persona = this.global.persona.value;
  }

  save(): Promise<any> {
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

  discardChanges(): void {
    this.ctx.rollback();
  }
}
