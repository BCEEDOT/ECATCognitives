import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {



  private cogResultId: string;

  constructor(
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.cogResultId = params['cogId'];
    });
  }



  ngOnInit() {
    
  }




}
