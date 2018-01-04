import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  cogResultId: string;

  constructor(
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private router: Router, ) {
    this.route.params.subscribe(params => {
      this.cogResultId = params['cogId'];
    });
  }

  goBack(): void {
    this.dialogService.openConfirm({
      message: 'Please save your results before leaving the page. Are you sure you want to go back?',
      title: 'Return to Cogntives Home',
      acceptButton: 'Yes',
      cancelButton: 'No'
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.router.navigate(['/cognitives']);
      }
    });
  }

  save(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
          <style>
           body {
            font-family: "Roboto", Arial, Helvetica, sans-serif;
           }

           h1, h2, h3, h4, h5 {
             font-weight: 500;
           }

           .pad-sm {
             padding: 5px;
           }

           .bold {
            font-weight: 500;
        }

           .rectangle {
            
            border: 12px solid #365F7F;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  ngOnInit() {
  }
}
