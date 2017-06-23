import { Component, OnInit, Input } from '@angular/core';

import { MpCommentType } from '../../../../core/common/mapStrings';
import { CrseStudentInGroup, WorkGroup } from '../../../../core/entities/faculty';
import { SpProviderService } from '../../../../provider/sp-provider/sp-provider.service';
import { FacWorkgroupService } from '../../../services/facworkgroup.service';

@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

  groupMembers: CrseStudentInGroup[];
  readOnly: boolean = false;

  constructor(private spProvider: SpProviderService,
  private facWorkGroupService: FacWorkgroupService) { }

  @Input() members: CrseStudentInGroup[];

  ngOnInit() {

    this.facWorkGroupService.readOnly$.subscribe(status => {
      this.readOnly = status;
      this.activate();
    });
    
    this.activate();
  }

  activate():void {
    this.groupMembers = this.members;

    this.groupMembers.forEach(gm => {
      gm.updateStatusOfStudent();
      const hasComment = gm.statusOfStudent.hasComment;
      const assessComplete = gm.statusOfStudent.assessComplete;
      gm['hasChartData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
      let commentText = '';
      let assessText = '';

      if (this.readOnly) {
        commentText = hasComment ? 'comment' : 'not_interested';
        assessText = assessComplete ? 'view_list' : 'None';
      } else {
        commentText = hasComment ? 'mode_edit' : 'add';
        assessText = assessComplete ? 'mode_edit' : 'add';
      }
      gm['commentText'] = commentText;
      gm['assessText'] = assessText;

      console.log(gm['commentText'] );
      console.log(gm['assessText']);
    });

    if (!this.groupMembers.some(mem => mem.statusOfStudent.assessComplete === false)){
      this.facWorkGroupService.assessComplete(true);
    } else {
      this.facWorkGroupService.assessComplete(false);
    }
  }


  comment(recipient: CrseStudentInGroup): any {
    this.spProvider.loadComment(recipient).subscribe(() => { this.activate()});
  }

}
