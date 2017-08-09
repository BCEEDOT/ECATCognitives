import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  //selector: 'app-lmsadmin',
  templateUrl: './lmsadmin.component.html',
  styleUrls: ['./lmsadmin.component.scss']
})
export class LmsadminComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.router.navigate(['courses'], {relativeTo: this.route});
  }

}
