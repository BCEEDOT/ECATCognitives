import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi } from './data';
import { single} from './singledata';


@Component({
  selector: 'assess-compare-dialog',
  templateUrl: './assess-compare.dialog.html',
  styleUrls: ['./assess-compare.dialog.scss']
})
export class AssessCompareDialog implements OnInit {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  single: any[];
  multi: any[];

  view: any[] = [900, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Behavior';
  showYAxisLabel = true;
  yAxisLabel = 'Rating';

  blueOrangeScheme: any = {
    domain: ['#0D47A1', '#01579B', '#1976D2', '#039BE5', '#00BCD4', '#FB8C00', '#FFA726', '#FFCC80', '#FFECB3'],
  };

  constructor(public dialogRef: MdDialogRef<AssessCompareDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) {

    Object.assign(this, {single, multi});

  }

  ngOnInit() {
  }

  onSelect(event) {

    this.multi = this.multi.filter(data => data.name != event);
    console.log(event);


  }

  ratings(val: any): any {
    if (val == 0) {
      return 'IEA'
    }
    if (val == 1) {
      return 'IEU'
    }
    if (val == 2) {
      return 'ND'
    }
    if (val == 3) {
      return 'EFA'
    }
    if (val == 4) {
      return 'EFU'
    }
    if (val == 5) {
      return 'HEU'
    }
    if (val == 6) {
      return 'HEA'
    }
  }

}
