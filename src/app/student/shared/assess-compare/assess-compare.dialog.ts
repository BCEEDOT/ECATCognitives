import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { TdChipsComponent } from "@covalent/core";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi } from './data';
import { single} from './singledata';


@Component({
  selector: 'assess-compare-dialog',
  templateUrl: './assess-compare.dialog.html',
  styleUrls: ['./assess-compare.dialog.scss'],
  viewProviders: [TdChipsComponent]
})
export class AssessCompareDialog implements OnInit {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  single: any[];
  multi: any[];
  multiOriginal: any[];
  readOnly: boolean = false;
  chipAddition: boolean = true;
  itemsRequireMatch: string[] = [];
  items: string[] = [];

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

  constructor(public dialogRef: MdDialogRef<AssessCompareDialog>, private chips: TdChipsComponent,
    @Inject(MD_DIALOG_DATA) public data: any) {

    Object.assign(this, {single, multi});
    this.multiOriginal = this.multi;

    this.multi.forEach(data => {
      this.items.push(data.name);
      this.itemsRequireMatch.push(data.name);
    })

  }

  add(value: string): void {

    let multiTest; 
    
    multiTest = this.multi;

    console.log(this.multiOriginal);

    this.multi = this.multiOriginal.filter(data => {

      let match = false;

      this.itemsRequireMatch.forEach(item => {
        if (data.name == item) {
          match = true;
        }

      });

      return match;
    });

  }

  remove(value: string): void {
    console.log(value);
    this.multi = this.multi.filter(data => data.name != value);
  }

  ngOnInit() {
    console.log(this.itemsRequireMatch);
  }

  // onSelect(event) {

  //   this.multi = this.multi.filter(data => data.name != event);
    
  //   console.log(event);


  // }

  reset(): void {
    // this.multi = this.multiOriginal;
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
