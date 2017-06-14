import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup, CrseStudentInGroup } from "../../../../core/entities/faculty";

@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

  groupMembers: CrseStudentInGroup[];
  isViewOnly: boolean = false;

  constructor() { }

  @Input() workGroup: WorkGroup;

  ngOnInit() {
    this.groupMembers = this.workGroup.groupMembers;

    console.log(this.groupMembers);

    // this.groupMembers.forEach(gm => {
    //   const hasComment = gm.statusOfStudent.hasComment;
    //   const assessComplete = gm.statusOfStudent.assessComplete;
    //   gm['hasChartData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
    //   let commentText = '';
    //   let assessText = '';

    //   if (this.isViewOnly) {
    //     commentText = hasComment ? 'View' : 'None';
    //     assessText = assessComplete ? 'View' : 'None';
    //   } else {
    //     commentText = hasComment ? 'Edit' : 'Add';
    //     assessText = assessComplete ? 'Edit' : 'Add';
    //   }
    //   gm['commentText'] = commentText;
    //   gm['assessText'] = assessText;
    // });
  }

}
