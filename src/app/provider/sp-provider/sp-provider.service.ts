import { Injectable } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { isNumeric } from 'rxjs/util/isNumeric';
import 'rxjs/util/isNumeric';


// import { BaseDataContext } from '../../shared/services/base-data-context.service';
// import { IStudSpInventory, IFacSpInventory } from '../../core/entities/client-models'
// import { StudSpComment } from "../../core/entities/student/StudSpComment";
// import { FacSpComment } from "../../core/entities/faculty/FacSpComment";
import { CrseStudentInGroup, WorkGroup } from "../../core/entities/Student";
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";
import { Person } from "../../core/entities/user/Person";
import { StudentDataContext } from "../../student/services/student-data-context.service";
import { WorkGroupService } from "../../student/services/workgroup.service";



@Injectable()
export class SpProviderService {
  // inventories: Array<IStudSpInventory | IFacSpInventory>;
  // comment: StudSpComment | FacSpComment;
  // persona: ILoggedInUser;
  // viewOnly: boolean;
  //private ctx: IAssessContext;

  //private off: Promise<Array<CrseStudentInGroup>>;
  private off: any;
  workGroup: WorkGroup

  constructor(private ctx: StudentDataContext, private stuWorkGroupService: WorkGroupService) { }

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

  evaluateStratification(isInstructor?: boolean, force?: boolean): Promise<Array<CrseStudentInGroup>> {
    const that = this;

    if (this.off) {
      clearTimeout(this.off);
    }

    if (force) {
      return Promise.resolve(evaluate())
    } else {
      this.off = setTimeout(() => {
        return Promise.resolve(evaluate());
      }, 1000);
    }


    function evaluate(): Array<CrseStudentInGroup> {
      const members = (isInstructor) ?
        //that.dCtx.faculty.getActiveWgMembers() :
        //that.dCtx.student.getActiveWgMemberships();
        null :
        that.stuWorkGroupService.workGroup$.value.groupMembers //TODO: Fill with Instructor activeworkgroup members

      //this.workGroupService.workGroup$.value.groupMembers

      members.forEach((member: CrseStudentInGroup, i, array: Array<CrseStudentInGroup>) => {
        member.stratValidationErrors = [];

        if (!isInstructor) {
          //Look at the assessee stratResponses as view for the logged in member who is the assesssor.
          const assessStratResponse = member.assesseeStratResponse[0];

          if (!assessStratResponse && !member.proposedStratPosition) {
            member.stratValidationErrors.push({
              cat: 'Required',
              text: 'Without a current strat, a numerical value greater than 0 must be entered in proposed change.'
            });
          }

          if (assessStratResponse && assessStratResponse.stratPosition > array.length && !member.proposedStratPosition) {
            member.stratValidationErrors.push({
              cat: 'Value greater than number of group members',
              text: 'The current stratification should not be greater than the number of group members.'
            });
          }

        } else {
          // if ((!member.facultyStrat || !member.facultyStrat.stratPosition) && !member.proposedStratPosition) {
          //   member.stratValidationErrors.push({
          //     cat: 'Required',
          //     text: 'Proposed strat must be greater than 0'
          //   });
          // }


        }

        if (member.proposedStratPosition) {
          if (!isNumeric(member.proposedStratPosition)) {
            member.stratValidationErrors.push({
              cat: 'Value must be a number',
              text: 'The proposed change should be a number.'
            });
          }

          if (member.proposedStratPosition > array.length) {
            member.stratValidationErrors.push({
              cat: 'Value greater than number of group members',
              text: 'The proposed change should not be greater than the number of group members.'
            });
          }

          if (member.proposedStratPosition < 1) {
            member.stratValidationErrors.push({
              cat: 'Value must be greater than Zero',
              text: 'The proposed change should be greater than zero.'
            });
          }

          array
            .filter(p => p.proposedStratPosition === member.proposedStratPosition && p.studentId !== member.studentId)
            .forEach(pp => {
              member.stratValidationErrors.push({
                cat: 'Duplicate',
                text: `${pp.rankName}: has an identical proposed change`
              });
            });

          if (!isInstructor) {
            array
              .filter(p => p.assesseeStratResponse.some(response => response.stratPosition === member.proposedStratPosition &&
                response.stratPosition !== null &&
                p.proposedStratPosition === null))
              .forEach(pp => {
                member.stratValidationErrors.push({
                  cat: 'Duplicate - Another member is currently at this position without a proposed change',
                  text: `${pp.rankName}: is currently at this position without a proposed change.`
                });
              });
          } else {
            // array
            //   .filter(p => p.facultyStrat && p.facultyStrat.stratPosition === member.proposedStratPosition &&
            //     p.facultyStrat.stratPosition !== null &&
            //     p.proposedStratPosition === null)
            //   .forEach(pp => {
            //     member.stratValidationErrors.push({
            //       cat: 'Duplicate',
            //       text: `${pp.rankName}: is currently at this position without a proposed change.`
            //     });
            //   });
          }
        }
        member.stratIsValid = member.stratValidationErrors.length === 0;
      });

      return members;

      //Possibly need to store changes back in the workgroupservice. 

    }
  }
}
