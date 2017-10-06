import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/pluck';

import { TdLoadingService, TdDialogService } from '@covalent/core';

import { CogInstrument } from '../../core/entities/user';
import { CogInventory } from '../../core/entities/user/cogInventory';
import { CogAssessService } from '../services/cog-assess.service';
import { MpCogInstrumentType } from "../../core/common/mapStrings";

@Component({
    selector: 'app-assess',
    templateUrl: './assess.component.html',
    styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

    cogAssessId: string;
    cogInventories$: Observable<CogInventory[]>;
    showInstructions: boolean = true;
    cogInventories: CogInventory[];
    readyToSave: boolean = false;
    cogName: string;

    constructor(
        private route: ActivatedRoute, private cogAssessService: CogAssessService,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        private router: Router,
        private snackBarService: MdSnackBar
    ) {
        this.route.params.subscribe(params => {
            this.cogAssessId = params['cogId'];
        });
        this.cogInventories$ = route.data.pluck('assess');
        console.log(route.data);
    }

    ngOnDestroy() {
        this.cogAssessService.cogActiveInventory(null);
        this.cogAssessService.cogInventories(null);
    };

    ngOnInit() {
        this.cogInventories$.subscribe((cogInventories: CogInventory[]) => {
            this.cogAssessService.cogInventories(cogInventories);
            this.cogInventories = cogInventories;

            switch (this.cogInventories[0].instrument.mpCogInstrumentType) {
                case MpCogInstrumentType.ecpe:
                    this.cogName = 'e-CPE - Cognitive Preference';
                    break;
                case MpCogInstrumentType.etmpre:
                    this.cogName = 'e-TMPRE - Team Member Role'
                    break;
                case MpCogInstrumentType.esalb:
                    this.cogName = 'e-SALB - Leadership Behavior'
                    break;
                case MpCogInstrumentType.ecmspe:
                    this.cogName = 'e-CMSPE - Conflict Management'
                    break;
            }
        })
        this.cogAssessService.readyToSave$.subscribe(readyToSave => {
            this.readyToSave = readyToSave;
        })
    }

    cancelAssess(): void {
        this.cogAssessService.cancelAssess();
    }

    saveAssess(): void {
        this.dialogService.openConfirm({
            message: 'Are you sure you want to complete the Assessment?',
            title: 'Complete Assessment',
            acceptButton: 'Yes',
            cancelButton: 'No'
        }).afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.loadingService.register();
                this.cogAssessService.saveAssess().subscribe(value => {
                    this.router.navigate(['/cognitives/result/' + this.cogAssessId]);
                }),
                    (error) => {
                        this.snackBarService.open('Error saving assessment, please try again', 'Dismiss', { duration: 2000 })
                    };

            }
        });

    }

}