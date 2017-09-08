import { Component, OnInit, OnChanges, Input, Output } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';

import { SpResult, SpInventory } from '../../../core/entities/student';
import { WorkGroupService } from '../../services/workgroup.service';
import { GlobalService } from '../../../core/services/global.service';
import { SpProviderService } from '../../../provider/sp-provider/sp-provider.service';
import { MpSpItemResponse } from '../../../core/common/mapStrings';

@Component({
  selector: 'behaviors',
  templateUrl: './behaviors.component.html',
  styleUrls: ['./behaviors.component.scss']
})
export class BehaviorsComponent implements OnChanges {

  inventories: SpInventory[] = [];
  // chartColors = {domain: ['#00308F','#0056FF', '#00AA58', '#00FF84', '#AAAAAA', '#AA0000', 'FF0000']};

  @Input() memberResults: SpResult;
  @Input() change: number;

  chartColors: any = { domain: [] };

  ngOnChanges(): void {
    this.activate();
  }

  activate(): void {
    this.inventories = this.memberResults.resultFor.workGroup.assignedSpInstr.inventoryCollection.sort((a, b) => {
      if (a.displayOrder < b.displayOrder) { return -1; }
      if (a.displayOrder > b.displayOrder) { return 1; }
      return 0;
    });

    this.inventories.forEach((inv: SpInventory) => {
      // let chartColors = {  domain: [] };
      inv.resultBreakOut.peerBoChart.forEach((data: any) => {
        if (data.name === MpSpItemResponse.hea) {
          this.chartColors.domain.push('#00308F');
        }
        if (data.name === MpSpItemResponse.heu) {
          this.chartColors.domain.push('#0056FF');
        }
        if (data.name === MpSpItemResponse.ea) {
          this.chartColors.domain.push('#00AA58');
        }
        if (data.name === MpSpItemResponse.eu) {
          this.chartColors.domain.push('#00FF84');
        }
        if (data.name === MpSpItemResponse.nd) {
          this.chartColors.domain.push('#AAAAAA');
        }
        if (data.name === MpSpItemResponse.ieu) {
          this.chartColors.domain.push('#AA0000');
        }
        if (data.name === MpSpItemResponse.iea) {
          this.chartColors.domain.push('#FF0000');
        }

        inv.resultBreakOut.peerBoChart['chartColors'] = this.chartColors;

      })
    })
  }

}
