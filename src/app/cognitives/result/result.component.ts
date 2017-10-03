import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  cogResultId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router, ) {
    this.route.params.subscribe(params => {
      this.cogResultId = params['cogId'];
    });
  }

  goBack(): void {
    this.router.navigate(['/cognitives']);
  }

  ngOnInit() {
  }
}
