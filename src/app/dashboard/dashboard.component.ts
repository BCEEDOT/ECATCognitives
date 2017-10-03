import { Component, AfterViewInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';

import { TdLoadingService, TdDigitsPipe } from '@covalent/core';

@Component({
  selector: 'qs-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  viewProviders: [],
})
export class DashboardComponent implements AfterViewInit {

  constructor(private titleService: Title) {
  }

  ngAfterViewInit(): void {
    this.titleService.setTitle('Dashboard');
  }

  // ngx transform using covalent digits pipe

}
