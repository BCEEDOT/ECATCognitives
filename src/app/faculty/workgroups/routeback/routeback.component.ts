import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { FacWorkgroupService } from "../../services/facworkgroup.service";

@Component({
  selector: 'app-routeback',
  templateUrl: './routeback.component.html',
  styleUrls: ['./routeback.component.scss']
})
export class RoutebackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private facWorkGroupSerice: FacWorkgroupService) { }

  ngOnInit() {
    let course = this.facWorkGroupSerice.course$.value;

    this.router.navigate(['list', course.id], { relativeTo: this.route });

  }

}
