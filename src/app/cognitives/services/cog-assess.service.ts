import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from "@angular/router";
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';
import { Observable } from "rxjs/Observable";

import { CogResultsService } from "./cog-results.service";
import { CogInstrument, CogInventory, CogEcpeResult, CogEcmspeResult, CogEsalbResult, CogEtmpreResult } from "../../core/entities/user";
import { MpCogInstrumentType, MpCogETMPREInvType, MpCogESALBInvType, MpCogECMSPEInvType } from "../../core/common/mapStrings";
import { UserDataContext } from "../../core/services/data/user-data-context.service";


@Injectable()
export class CogAssessService {

    cogInventories$: BehaviorSubject<CogInventory[]> = new BehaviorSubject({} as CogInventory[]);
    cogActiveInventory$: BehaviorSubject<CogInventory> = new BehaviorSubject({} as CogInventory);
    readyToSave$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private userDataContext: UserDataContext, private snackBarService: MdSnackBar,
        private dialogService: TdDialogService, private loadingService: TdLoadingService, 
        private router: Router, private cogResultsService: CogResultsService) { }

    cogInventories(cogInventories: CogInventory[]) {
        this.cogInventories$.next(cogInventories);
    }

    cogActiveInventory(cogActiveInventory: CogInventory) {
        this.cogActiveInventory$.next(cogActiveInventory);
    }

    readyToSave(readyToSave: boolean) {
        this.readyToSave$.next(readyToSave);
    }

    previousInventory() {
        let prev = this.cogInventories$.value.find(inv => inv.displayOrder === (this.cogActiveInventory$.value.displayOrder - 1));
        this.cogActiveInventory(prev);
        if (this.cogActiveInventory$.value.instrument.mpCogInstrumentType !== MpCogInstrumentType.etmpre) {
            this.checkReadyToSave();
        }
    }

    nextInventory() {
        if (this.cogActiveInventory$.value.displayOrder === 1) {
            this.cogActiveInventory$.value.isChanged = true;
        }
        let next = this.cogInventories$.value.find(inv => inv.displayOrder === (this.cogActiveInventory$.value.displayOrder + 1));
        this.cogActiveInventory(next);
        this.cogActiveInventory$.value.isChanged = true;

        if (this.cogActiveInventory$.value.instrument.mpCogInstrumentType !== MpCogInstrumentType.etmpre) {
            this.checkReadyToSave();
        }
    }

    cancelAssess() {
        let hasChanges = this.cogInventories$.value.some(inventory => inventory.isChanged === true);

        if (hasChanges = true) {
            this.dialogService.openConfirm({
                message: 'Are you sure you want to cancel and discard your changes?',
                title: 'Unsaved Changed',
                acceptButton: 'Yes',
                cancelButton: 'No'
            }).afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.cogInventories$.value.forEach(inventory => inventory.rejectChanges());
                    this.snackBarService.open('Changes Discarded', 'Dismiss', { duration: 2000 })
                    this.router.navigate(['/cognitives']);
                }
            });
        } else {
            this.router.navigate(['/cognitives']);
        }
    }

    saveAssess(): Observable<String> {
        //let successString: String;
        let result = this.userDataContext.getNewCogResult(this.cogActiveInventory$.value.instrument.mpCogInstrumentType,
            this.cogActiveInventory$.value.instrumentId, 0);

        //results calcuation
        switch (this.cogActiveInventory$.value.instrument.mpCogInstrumentType) {
            case MpCogInstrumentType.ecpe:
                result = this.calcEcpe(result);
                //We do this (for all cogs below) to update the results service when going back to it after completion of a cognitive
                this.cogResultsService.cogEcpeResult(result);
                break;
            case MpCogInstrumentType.etmpre:
                result = this.calcEtmpre(result)
                this.cogResultsService.cogEtmpreResult(result);
                break;
            case MpCogInstrumentType.esalb:
                result = this.calcEsalb(result);
                this.cogResultsService.cogEsalbResult(result);
                break;
            case MpCogInstrumentType.ecmspe:
                result = this.calcEcmspe(result);
                this.cogResultsService.cogEcmspeResult(result);
                break;
        }
        this.userDataContext.commit()
            .then(result => {
                this.loadingService.resolve();
                this.snackBarService.open("Success, Cognitive Asessment Saved!", 'Dismiss', { duration: 2000 })
            })
            .catch(result => {
                this.loadingService.resolve();
                this.dialogService.openAlert({
                    message: 'Your changes were not saved, please try again.',
                    title: 'Save Error',
                });
                return Observable.throw(result);
            })

           return Observable.of('Success');

    } //END SAVE ASSESS

    public checkReadyToSave(): void {
        let allValidValues = false;
        //ETMPRE uses buttons, so we check if there is a score selected
        //Sliders all start at 500, which is a valid selection, so we can't check score
        if (this.cogActiveInventory$.value.instrument.mpCogInstrumentType === MpCogInstrumentType.etmpre) {
            allValidValues = this.cogInventories$.value.every(item => item.response.itemScore !== null);
        } else {
            allValidValues = this.cogInventories$.value.every(inventory => inventory['isChanged'] === true)
        }
        this.readyToSave(allValidValues);
    }

    private calcEcpe(result: CogEcpeResult): CogEcpeResult {
        let totalScore = 0;
        let scoredItems = this.cogInventories$.value.filter(inv => inv.isScored === true);

        scoredItems.forEach(inv => {
            if (!inv.isReversed) {
                totalScore += inv.response.itemScore;
            } else {
                //If the descriptions are reversed, we have to reverse the score
                let reversed = 0;
                if (inv.response.itemScore > 500) {
                    reversed = inv.response.itemScore - 500;
                    reversed = 500 - reversed;
                } else if (inv.response.itemScore < 500) {
                    reversed = 500 - inv.response.itemScore;
                    reversed = 500 + reversed;
                } else {
                    reversed = inv.response.itemScore;
                }
                totalScore += reversed;
            }
        });
        result.outcome = Math.round(totalScore / scoredItems.length);
        return result;
    }

    private calcEtmpre(result: CogEtmpreResult): CogEtmpreResult {
        let creator = 0;
        let advancer = 0;
        let refiner = 0;
        let executor = 0;

        this.cogInventories$.value.forEach(inv => {
            switch (inv.itemType) {
                case MpCogETMPREInvType.spont:
                    creator += inv.response.itemScore;
                    advancer += inv.response.itemScore;
                    break;
                case MpCogETMPREInvType.norm:
                    advancer += inv.response.itemScore;
                    executor += inv.response.itemScore;
                    break;
                case MpCogETMPREInvType.meth:
                    refiner += inv.response.itemScore;
                    executor += inv.response.itemScore;
                    break;
                case MpCogETMPREInvType.conc:
                    creator += inv.response.itemScore;
                    refiner += inv.response.itemScore;
                    break;
            }
        });

        //At least one bar on the result will always go all the way across and the rest are scaled to that
        //Is this the way we want to do it?
        //let scale = Math.max(creator, advancer, refiner, executor);
        //result.creator = Math.round((creator / scale) * 100);
        //result.advancer = Math.round((advancer / scale) * 100);
        //result.refiner = Math.round((refiner / scale) * 100);
        //result.executor = Math.round((executor / scale) * 100);
        let testArray = [creator, advancer, refiner, executor]
        const u = {};
        const a = [];
        for (var i = 0, l = testArray.length; i < l; ++i) {
            if (u.hasOwnProperty(testArray[i])) {
                continue;
            }
            a.push(testArray[i]);
            u[testArray[i]] = 1;
        }

        //BCAT works more like this:
        let uniqueArray = a.sort();
        let max = Math.max(...uniqueArray);
        let second = 0;
        let third = 0;
        let fourth = 0;

        //no breaks is intentional
        switch (uniqueArray.length) {
            case 4: fourth = uniqueArray[uniqueArray.length - 4];
            case 3: third = uniqueArray[uniqueArray.length - 3];
            case 2: second = uniqueArray[uniqueArray.length - 2];
            case 1:
        }
        switch (creator) {
            case max: result.creator = 100; break;
            case second: result.creator = 75; break;
            case third: result.creator = 50; break;
            case fourth: result.creator = 25; break;
        }
        switch (advancer) {
            case max: result.advancer = 100; break;
            case second: result.advancer = 75; break;
            case third: result.advancer = 50; break;
            case fourth: result.advancer = 25; break;
        }
        switch (refiner) {
            case max: result.refiner = 100; break;
            case second: result.refiner = 75; break;
            case third: result.refiner = 50; break;
            case fourth: result.refiner = 25; break;
        }
        switch (executor) {
            case max: result.executor = 100; break;
            case second: result.executor = 75; break;
            case third: result.executor = 50; break;
            case fourth: result.executor = 25; break;
        }
        //BCAT
        return result;
    }

    private calcEsalb(result: CogEsalbResult): CogEsalbResult {
        let laissezFaire = 0;
        let lzNum = 0;
        let management = 0;
        let manNum = 0;
        let contingent = 0;
        let conNum = 0;
        let idealized = 0;
        let idealNum = 0;
        let inspirational = 0;
        let inspirNum = 0;
        let intellectualStim = 0;
        let intelNum = 0;
        let individual = 0;
        let indNum = 0;

        this.cogInventories$.value.forEach(inv => {
            switch (inv.itemType) {
                case MpCogESALBInvType.lais:
                    laissezFaire += inv.response.itemScore;
                    lzNum += 1;
                    break;
                case MpCogESALBInvType.man:
                    management += inv.response.itemScore;
                    manNum += 1;
                    break;
                case MpCogESALBInvType.cont:
                    contingent += inv.response.itemScore;
                    conNum += 1;
                    break;
                case MpCogESALBInvType.ideal:
                    idealized += inv.response.itemScore;
                    idealNum += 1;
                    break;
                case MpCogESALBInvType.inspir:
                    inspirational += inv.response.itemScore;
                    inspirNum += 1;
                    break;
                case MpCogESALBInvType.intellect:
                    intellectualStim += inv.response.itemScore;
                    intelNum += 1;
                    break;
                case MpCogESALBInvType.indiv:
                    individual += inv.response.itemScore;
                    indNum += 1;
                    break;
            }
        });

        //(num of category inventories * 2) * 100 to get to a 1-5 scale to match BCAT, which uses a max 500 slider rather than 1000
        result.laissezFaire = parseFloat((laissezFaire / ((lzNum * 2) * 100)).toFixed(2));
        result.management = parseFloat((management / ((manNum * 2) * 100)).toFixed(2));
        result.contingent = parseFloat((contingent / ((conNum * 2) * 100)).toFixed(2));
        result.idealized = parseFloat((idealized / ((idealNum * 2) * 100)).toFixed(2));
        result.inspirational = parseFloat((inspirational / ((inspirNum * 2) * 100)).toFixed(2));
        result.intellectualStim = parseFloat((intellectualStim / ((intelNum * 2) * 100)).toFixed(2));
        result.individual = parseFloat((individual / ((indNum * 2) * 100)).toFixed(2));

        return result;
    }


    private calcEcmspe(result: CogEcmspeResult): CogEcmspeResult {
        let compete = 0;
        let competeNum = 0;
        let collab = 0;
        let collabNum = 0;
        let accom = 0;
        let accomNum = 0;
        let avoid = 0;
        let avoidNum = 0;
        let compro = 0;
        let comproNum = 0;

        this.cogInventories$.value.forEach(inv => {
            switch (inv.itemType) {
                case MpCogECMSPEInvType.compete:
                    compete += inv.response.itemScore;
                    competeNum += 1;
                    break;
                case MpCogECMSPEInvType.collab:
                    collab += inv.response.itemScore;
                    collabNum += 1;
                    break;
                case MpCogECMSPEInvType.accom:
                    accom += inv.response.itemScore;
                    accomNum += 1;
                    break;
                case MpCogECMSPEInvType.avoid:
                    avoid += inv.response.itemScore;
                    avoidNum += 1;
                    break;
                case MpCogECMSPEInvType.compro:
                    compro += inv.response.itemScore;
                    comproNum += 1;
                    break;
            }
        });

        result.compete = parseFloat((compete / competeNum).toFixed(2));
        result.collaborate = parseFloat((collab / collabNum).toFixed(2));
        result.accommodate = parseFloat((accom / accomNum).toFixed(2));
        result.avoid = parseFloat((avoid / avoidNum).toFixed(2));
        result.compromise = parseFloat((compro / comproNum).toFixed(2));

        return result;
    }

}