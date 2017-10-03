import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';

@Component({
  //selector: 'app-lmsadmin',
  templateUrl: './lmsadmin.component.html',
  styleUrls: ['./lmsadmin.component.scss']
})
export class LmsadminComponent implements OnInit {

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle('Instructional System Admin');
    this.router.navigate(['courses'], {relativeTo: this.route});
  }

}
