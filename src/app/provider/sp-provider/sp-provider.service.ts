import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { isNumeric } from 'rxjs/util/isNumeric';
import 'rxjs/util/isNumeric';
import 'rxjs/add/observable/of';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CrseStudentInGroup as StuCrseStudentInGroup, WorkGroup, StudSpComment } from "../../core/entities/student";
import { CrseStudentInGroup as FacCrseStudentInGroup } from "../../core/entities/faculty";
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";
import { Person } from "../../core/entities/user/Person";
import { StudentDataContext } from "../../student/services/student-data-context.service";
import { FacultyDataContextService } from "../../faculty/services/faculty-data-context.service";
import { WorkGroupService } from "../../student/services/workgroup.service";
import { FacWorkgroupService } from "../../faculty/services/facworkgroup.service";
import { FacSpComment } from "../../core/entities/faculty/FacSpComment";
import { CommentDialog } from "./comment/comment.dialog";

@Injectable()
export class SpProviderService {
  dialogRef: MdDialogRef<CommentDialog>;
  commentClosed$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  off: any;
  workGroup: WorkGroup;

  constructor(private studentDataContext: StudentDataContext,
    private stuWorkGroupService: WorkGroupService,
    private facWorkGroupService: FacWorkgroupService,
    private facultyDataContext: FacultyDataContextService,
    private global: GlobalService,
    private dialog: MdDialog) {
  }

  save(): Promise<any> {

    if (this.global.persona.value.isStudent) {
      return this.studentDataContext.commit()
        .then((result) => {
          console.log('success');
          return result;
        })
        .catch((result) => {
          console.log('error');
          return result;
        })
    } else {
      return this.facultyDataContext.commit()
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

  commentClosed(commentClosed: boolean) {
    this.commentClosed$.next(commentClosed);
  }



  loadComment(recipient: StuCrseStudentInGroup | FacCrseStudentInGroup): Observable<MdDialogRef<CommentDialog>> {
    let comment;

    if (this.global.persona.value.isStudent) {
      comment = this.studentDataContext.getComment(recipient.courseId, recipient.workGroupId, recipient.studentId);
    } else {
      comment = this.facultyDataContext.getFacComment(recipient.courseId, recipient.workGroupId, recipient.studentId);
    }

    return this.dialog.open(CommentDialog, {
      disableClose: true,
      //hasBackdrop: true,
      data: {
        comment: comment,
      }
    }).afterClosed();

    // this.dialogRef.afterClosed().subscribe(() => {
    //   console.log('Comment closed');
    //   this.commentClosed(true);
    // });
  }

  evaluateStratification(isInstructor?: boolean, force?: boolean): Promise<Array<StuCrseStudentInGroup & FacCrseStudentInGroup>> {
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


    function evaluate(): Array<StuCrseStudentInGroup & FacCrseStudentInGroup> {

      let members;

      if (isInstructor) {
        members = that.facWorkGroupService.facWorkGroup$.value.groupMembers;
      } else {
        members = that.stuWorkGroupService.workGroup$.value.groupMembers;
      }

      members.forEach((member: StuCrseStudentInGroup & FacCrseStudentInGroup, i, array: Array<StuCrseStudentInGroup & FacCrseStudentInGroup>) => {
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
          if ((!member.facultyStrat || !member.facultyStrat.stratPosition) && !member.proposedStratPosition) {
            member.stratValidationErrors.push({
              cat: 'Required',
              text: 'Proposed strat must be greater than 0'
            });
          }


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
                cat: 'Duplicate - Another member has the same proposed change',
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
            array
              .filter(p => p.facultyStrat && p.facultyStrat.stratPosition === member.proposedStratPosition &&
                p.facultyStrat.stratPosition !== null &&
                p.proposedStratPosition === null)
              .forEach(pp => {
                member.stratValidationErrors.push({
                  cat: 'Duplicate - Another member is currently at this position without a proposed change',
                  text: `${pp.rankName}: is currently at this position without a proposed change.`
                });
              });
          }
        }
        member.stratIsValid = member.stratValidationErrors.length === 0;
      });

      return members;

      //Possibly need to store changes back in the workgroupservice. 

    }


  }
}
