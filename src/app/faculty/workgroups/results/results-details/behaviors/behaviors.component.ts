import { Component, OnInit, Input } from '@angular/core';
import { CrseStudentInGroup, SpInventory, SpResult, SpResultBreakOut } from "../../../../../core/entities/faculty";

@Component({
  selector: 'results-behaviors',
  templateUrl: './behaviors.component.html',
  styleUrls: ['./behaviors.component.scss']
})
export class BehaviorsComponent implements OnInit {
  @Input() student: CrseStudentInGroup;
  inventories: SpInventory[];
  //chartColors = {domain: ['#AA0000', '#FE6161', '#AAAAAA', '#00AA58', '#73FFBB', '#00308F', '#7CA8FF']};
  chartColors = {domain: ['#00308F', '#00AA58', '#AAAAAA', '#AA0000']};
  //chartColors = {domain: ['#AA0000', '#AAAAAA', '#00AA58', '#00308F']};
  
  constructor() { }

  ngOnInit() {
    this.inventories = this.student.workGroup.assignedSpInstr.inventoryCollection;
    this.inventories.forEach(inv => {
      inv.resetResults();
    });
  }

}
