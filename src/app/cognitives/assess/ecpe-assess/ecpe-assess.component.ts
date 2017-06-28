import { Component, OnInit } from '@angular/core';
import { BaseChartComponent } from '@swimlane/ngx-charts/release';

import { BaseAssessService } from "../services/base-assess.service";
import { CogInstrument, CogInventory, CogResponse } from "../../../core/entities/user";
import { CogAssessService } from "../../services/cog-assess.service";

@Component({
  selector: 'ecpe-assess',
  templateUrl: './ecpe-assess.component.html',
  styleUrls: ['./ecpe-assess.component.scss']
})
export class EcpeAssessComponent implements OnInit {

  ecpeInventories: CogInventory[]
  activeInventory: CogInventory;
  inventories: CogInventory[];
  sliderValue: number = 500;
  svg1x = 0;
  svg1y = 0;
  svg2x = 0;
  svg2y = 0;
  svg3x = 0;
  svg3y = 0;
  points = "0,0 0,0 0,0"

  constructor(private cogAssessService: CogAssessService) {
  }

  ngOnInit(): void {
    this.cogAssessService.cogInventories$.subscribe((cogInventories: CogInventory[]) => {
      this.ecpeInventories = cogInventories;
      this.activate();
    });

    this.cogAssessService.cogActiveInventory$.subscribe((cogInventory: CogInventory) => {
      this.activeInventory = cogInventory;
    })

    this.slide(this.activeInventory.response.itemScore);

  }

  activate(): void {
    this.inventories = this.ecpeInventories;
    this.activeInventory = this.inventories[0];
    this.inventories.forEach(inv => {
      if (inv.response.itemScore == 0) {
        inv.response.itemScore = this.sliderValue;
      }
    });
    this.cogAssessService.cogActiveInventory(this.activeInventory);
  }

  nextInventory(): void {
    this.cogAssessService.nextInventory();
    this.slide(this.activeInventory.response.itemScore);
  }

  previousInventory(): void {
    this.cogAssessService.previousInventory();
    this.slide(this.activeInventory.response.itemScore);
  }

  slide(value): void {
    let newValue = value;
    if (newValue > 500) {
      //svg is 570 wide, so > 500 slider values are based on 285 as the start, 570 as the end
      //for how tall the triangle is (svg1y) 0 is the top, 50 the bottom
      //svg2 is the static start point for > 500
      this.svg1x = (newValue / 1000) * 565;
      this.svg1y = 50 - ((newValue - 500) / 10);
      this.svg2x = 282.5;
      this.svg2y = 50;
      this.svg3x = (newValue / 1000) * 565;
      this.svg3y = 50;
    } else if (newValue < 500) {
      // < 500 is 280 start - 0 end, svg2y for height, and svg1 the static start point
      this.svg1x = 282.5;
      this.svg1y = 50;
      this.svg2x = (newValue / 500) * 282.5;
      this.svg2y = (newValue / 10);
      this.svg3x = (newValue / 500) * 282.5;
      this.svg3y = 50;
    } else {
      //Reset to nothing at 500, so it updates properly when changing pages
      this.svg1x = 0;
      this.svg1y = 0;
      this.svg2x = 0;
      this.svg2y = 0;
      this.svg3x = 0;
      this.svg3y = 0;
    }

    this.points = `${this.svg1x}, ${this.svg1y} ${this.svg2x}, ${this.svg2y} ${this.svg3x},${this.svg3y}`;
  }

}
