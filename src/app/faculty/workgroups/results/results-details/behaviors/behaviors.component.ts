import { Component, OnInit, Input } from '@angular/core';
//import { TdDialogService } from "@covalent/core";

import { CrseStudentInGroup, SpInventory, SpResult, SpResultBreakOut } from "../../../../../core/entities/faculty";

@Component({
  selector: 'results-behaviors',
  templateUrl: './behaviors.component.html',
  styleUrls: ['./behaviors.component.scss']
})
export class BehaviorsComponent implements OnInit {
  @Input() student: CrseStudentInGroup;
  inventories: SpInventory[];
  chartColors = {domain: ['#00308F', '#00AA58', '#AAAAAA', '#AA0000']};
  
  constructor(){}//private tdDialogService: TdDialogService) { }

  ngOnInit() {
    this.inventories = this.student.workGroup.assignedSpInstr.inventoryCollection.sort((a, b) => {
      if (a.displayOrder < b.displayOrder) { return -1; }
      if (a.displayOrder > b.displayOrder) { return 1; }
      return 0;
    });

    this.inventories.forEach(inv => {
      inv.resetResults();
    })
  }

  // behaviorDetails(inv: SpInventory){
  //   let message: string;
  //   let title: string;
  //   console.log(inv);
  //   this.tdDialogService.openAlert({message: inv.behaveResultForStudent[this.student.studentId].respByBehav.rcvdResp.toString(), title: 'Details'});
  // }

}
