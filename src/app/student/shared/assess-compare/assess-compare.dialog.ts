import { Component, Inject, ViewChild, TemplateRef, ContentChild } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { TdChipsComponent } from '@covalent/core';

import { WorkGroup, SpResponse, CrseStudentInGroup } from '../../../core/entities/student/index';
import { GlobalService } from '../../../core/services/global.service';

@Component({
  templateUrl: './assess-compare.dialog.html',
  styleUrls: ['./assess-compare.dialog.scss'],
  viewProviders: [TdChipsComponent]
})
export class AssessCompareDialog {

  @ViewChild(TemplateRef) template: TemplateRef<any>;
  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  single: any[] = [];
  multi: any[] = [];
  multiOriginal: any[];
  readOnly: boolean = false;
  chipAddition: boolean = true;
  itemsRequireMatch: string[] = [];
  items: string[] = [];
  view: any[] = [900, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Behavior';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Rating';

  blueOrangeScheme: any = {
    domain: ['#FF0101', '#FF7800', '#FFF300', '#8BFF00', '#08FF00', '#00FFBD', '#00A6FF', '#0008FF', '#7000FF'],
    // domain: ['#0D47A1', '#FFCC80', '#1976D2', '#039BE5', '#00BCD4', '#FB8C00', '#FFA726', '#FFCC80', '#FFECB3'],
  };

  constructor(public dialogRef: MdDialogRef<AssessCompareDialog>, private chips: TdChipsComponent, private globalService: GlobalService,
    @Inject(MD_DIALOG_DATA) public data: any) {

    let grp: WorkGroup = data.workGroup;

    let groupMembers: CrseStudentInGroup[] = grp.groupMembers.filter((gm: CrseStudentInGroup) => {
      if (gm.assesseeSpResponses && gm.assesseeSpResponses.length > 0) {
        return true;
      }
    });

    groupMembers.forEach((mem: CrseStudentInGroup) => {
      let memData: any = {
        name: '',
        series: [],
      };

      memData.name = mem.studentProfile.person.firstName.slice(0, 1) + '. ' + mem.studentProfile.person.lastName;
      if (mem.assesseeSpResponses || mem.assesseeSpResponses.length > 0) {
        mem.assesseeSpResponses.sort((a: SpResponse, b: SpResponse) => {
          if (a.inventoryItem.displayOrder < b.inventoryItem.displayOrder) { return -1; }
          if (a.inventoryItem.displayOrder > b.inventoryItem.displayOrder) { return 1; }
          return 0;
        });

        let i: number = 1;
        if (mem.studentId === this.globalService.persona.value.person.personId) {
          let selfResp: SpResponse[] = mem.assesseeSpResponses.filter((resp: SpResponse)  => resp.assesseePersonId === resp.assessorPersonId);
          selfResp.forEach((resp: SpResponse) => {
            let behavior: any = {
              name: '',
              value: 0,
            };
            behavior.name = resp.inventoryItem.behavior.slice(0, 15);
            behavior.value = resp.itemModelScore;
            memData.series.push(behavior);
            i++;
          });
        } else {
          mem.assesseeSpResponses.forEach((resp: SpResponse) => {
            let behavior: any = {
              name: '',
              value: 0,
            };
            behavior.name = resp.inventoryItem.behavior.slice(0, 15);
            behavior.value = resp.itemModelScore;
            memData.series.push(behavior);
            i++;
          });
        }
      }
      this.multi.push(memData);
    });
    this.multiOriginal = this.multi;

    this.multi.forEach((dataValue: any) => {
      this.itemsRequireMatch.push(dataValue.name);
    })

  }

  add(value: string): void {

    let multiTest: any[] = this.multi;
    this.multi = this.multiOriginal.filter((data: any) => {

      let match: boolean = false;

      this.itemsRequireMatch.forEach((item: string) => {
        if (data.name === item) {
          match = true;
        }

      });

      return match;
    });

    this.items = this.items.filter((item: string) => item !== value);
  }

  remove(value: string): void {
    this.items.push(value);
    this.multi = this.multi.filter(data => data.name !== value);
  }

  ratings(val: any): any {
    if (val === 0) {
      return 'IEA';
    }
    if (val === 1) {
      return 'IEU';
    }
    if (val === 2) {
      return 'ND';
    }
    if (val === 3) {
      return 'EFA';
    }
    if (val === 4) {
      return 'EFU';
    }
    if (val === 5) {
      return 'HEU';
    }
    if (val === 6) {
      return 'HEA';
    }
  }
}
