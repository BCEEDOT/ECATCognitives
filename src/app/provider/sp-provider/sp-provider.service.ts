import { Injectable } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

// import { BaseDataContext } from '../../shared/services/base-data-context.service';
// import { IStudSpInventory, IFacSpInventory } from '../../core/entities/client-models'
// import { StudSpComment } from "../../core/entities/student/StudSpComment";
// import { FacSpComment } from "../../core/entities/faculty/FacSpComment";
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";
import { Person } from "../../core/entities/user/Person";
import { StudentDataContext } from "../../student/services/student-data-context.service";

@Injectable()
export class SpProviderService {
  // inventories: Array<IStudSpInventory | IFacSpInventory>;
  // comment: StudSpComment | FacSpComment;
  // persona: ILoggedInUser;
  // viewOnly: boolean;
  //private ctx: IAssessContext;

  constructor(private ctx: StudentDataContext) { }

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
}
