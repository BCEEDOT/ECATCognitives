import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/pluck';

import { CogInstrument } from "../../core/entities/user";
import { CogAssessService } from "../services/cog-assess.service";


@Component({
    selector: 'app-assess',
    templateUrl: './assess.component.html',
    styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

    cogAssessId: string;
    cogInstrument$: Observable<CogInstrument[]>;
    showInstructions: boolean = true;
    cogInstrument: CogInstrument[];

    constructor(
        private route: ActivatedRoute, private cogAssessService: CogAssessService) {

        this.route.params.subscribe(params => {
            this.cogAssessId = params['cogId'];
        });

        this.cogInstrument$ = route.data.pluck('assess')
    }

    ngOnInit() {
        this.cogInstrument$.subscribe((cogInstrument: CogInstrument[]) => {
            this.cogAssessService.cogInstrument(cogInstrument);
            this.cogInstrument = cogInstrument;
        })


    }

}

/*import * as _mpe from 'core/common/mapEnum'
import * as _mp from 'core/common/mapStrings'
import _swal from "sweetalert"
import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'

interface IAssessPager {
    pageId: number;
    item: ecat.entity.ICogInventory;
}

export default class EcCogAssess {
    static controllerId = 'app.core.cog.cogAssess';
    static $inject = ['$scope', '$uibModalInstance', IDataCtx.serviceId, ICommon.serviceId, 'cogType', 'prevAttempt'];

    private activeInvent: ecat.entity.ICogInventory;
    private cogName: string;
    private cogType: string;
    private prevAttempt: number;
    private activeView: number;
    private views = {
        load: CogAssessViews.Loading,
        ecpe: CogAssessViews.ECPE,
        esalbecmspe: CogAssessViews.ESALBECMSPE,
        etmpre: CogAssessViews.ETMPRE
    }
    private showInstructions: boolean;

    private currentPage = 1;
    private previousPage = 1;

    private inventoryList: Array<ecat.entity.ICogInventory> = [];
    private isPristine = false;
    private pagers: Array<IAssessPager> = [];
    private readyToSave = false;

    private svg1x = 0;
    private svg1y = 0;
    private svg2x = 0;
    private svg2y = 0;
    private svg3x = 0;
    private svg3y = 0;

    constructor($scope: angular.IScope, private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private c: ICommon, cogType: string, prevAttempt: number) {
        this.cogType = cogType;
        this.prevAttempt = prevAttempt;
        this.showInstructions = true;
        if (cogType === _mp.MpCogInstrumentType.ecpe) {
            //Watch to dynamically change the svg polygon based on what the user does with the slider
            $scope.$watch('cogAssess.activeInvent.response.itemScore', (newValue: number, oldValue: number) => {
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
            });
        }
        this.activate();
    }

    private activate(): void {
        const that = this;

        this.dCtx.user.getCogAssess(this.cogType, this.prevAttempt).then(getAssessResult => {
            if (getAssessResult) {
                that.inventoryList = getAssessResult as Array<ecat.entity.ICogInventory>;
                const instrument = that.inventoryList[0].instrument;

                switch (instrument.mpCogInstrumentType) {
                    case _mp.MpCogInstrumentType.ecpe:
                        that.cogName = 'e-CPE - Cognitive Preference';
                        that.activeView = that.views.ecpe;
                        //Set all the itemScores at 500 so that sliders start in the middle
                        that.inventoryList.forEach(inv => inv.response.itemScore = 500);
                        break;
                    case _mp.MpCogInstrumentType.etmpre:
                        that.cogName = 'e-TMPRE - Team Member Role';
                        that.activeView = that.views.etmpre;
                        break;
                    case _mp.MpCogInstrumentType.esalb:
                        that.cogName = 'e-SALB - Leadership Behavior';
                        that.activeView = that.views.esalbecmspe;
                        that.inventoryList.forEach(inv => inv.response.itemScore = 500);
                        break;
                    case _mp.MpCogInstrumentType.ecmspe:
                        that.cogName = 'e-CMSPE - Conflict Management';
                        that.activeView = that.views.esalbecmspe;
                        that.inventoryList.forEach(inv => inv.response.itemScore = 500);
                        break;
                }

                document.getElementById('instructions').innerHTML = instrument.cogInstructions;

                that.pagers = that.inventoryList.map(item => {
                    const pager = {} as IAssessPager;
                    pager.pageId = item.displayOrder;
                    //item['isChanged'] = false;
                    pager.item = item;
                    return pager;
                }).sort(that.pagerSort);

                that.activeInvent = that.pagers[0].item;
            }
        });
    }

    protected cancel($event?: angular.IAngularEvent): void {

        const hasChanges = this.inventoryList.some(item => item.response.entityAspect.entityState.isAddedModifiedOrDeleted());

        if (hasChanges) {
            const alertSetting: SweetAlert.Settings = {
                title: 'Caution, Unsaved Changes',
                text: 'You have made changes to this assessment that have not been saved.\n\n Are you sure you want to cancel them?',
                type: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                closeOnCancel: true,
                closeOnConfirm: true,
                confirmButtonColor: '#F44336',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            };

            _swal(alertSetting, (confirmed?: boolean) => {
                if (confirmed) {
                    this.inventoryList.forEach(item => {
                        item.response.entityAspect.rejectChanges();
                        item['isChanged'] = false;
                    });

                    this.$mi.close(null);
                }
            });
        } else {
            this.inventoryList.forEach(item => {
                item.response.entityAspect.rejectChanges();
                item['isChanged'] = false;
            });
            this.$mi.close(null);
        }
    }

    private changePrevious(): void {
        if (this.cogType !== _mp.MpCogInstrumentType.etmpre) {
            this.activeInvent['isChanged'] = true;
        }
        this.activeInvent = this.pagers.filter(pager => pager.pageId === (this.currentPage - 1))[0].item;
        this.currentPage -= 1;
        this.checkReadyToSave();
    }

    private changeNext(): void {
        if (this.cogType !== _mp.MpCogInstrumentType.etmpre) {
            this.activeInvent['isChanged'] = true;
        }
        this.activeInvent = this.pagers.filter(pager => pager.pageId === (this.currentPage + 1))[0].item;
        this.currentPage += 1;
        
        if (this.currentPage === this.pagers.length && this.cogType !== _mp.MpCogInstrumentType.etmpre) {
            this.activeInvent['isChanged'] = true;
        }
        this.checkReadyToSave();
    }

    protected checkReadyToSave(): void {
        let allValidValues = false;

        //ETMPRE uses buttons, so we check if there is a score selected
        //Sliders all start at 500, which is a valid selection, so we can't check score
        if (this.cogType === _mp.MpCogInstrumentType.etmpre) {
            allValidValues = this.inventoryList.every(item => item.response.itemScore !== 0);
        } else {
            allValidValues = this.inventoryList.every(item => item['isChanged'] === true);
        }
        
        this.readyToSave = allValidValues;

        if (this.currentPage === this.pagers.length) {
            this.previousPage = this.currentPage;
            //this.changePage();
        }
    }

    private save(): void {
        const swalSettings: SweetAlert.Settings = {
            title: 'Oh no!, there was a problem updating this assessment. Try saving again, or cancel the current assessment and attempt this again later.',
            type: 'warning',
            allowEscapeKey: true,
            confirmButtonText: 'Ok'
        }

        const swalConfSettings: SweetAlert.Settings = {
                title: 'Complete Assessment',
                text: 'Are you sure you want to complete your assessment?',
                type: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                closeOnCancel: true,
                closeOnConfirm: true,
                confirmButtonColor: '#F44336',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
        }

        _swal(swalConfSettings, (confirmed?: boolean) => {
            if (confirmed) {
                let result = this.dCtx.user.getNewCogResult(this.cogType, this.inventoryList[0].instrumentId, this.prevAttempt);

                //results calcuation
                switch (this.cogType) {
                    case _mp.MpCogInstrumentType.ecpe:
                        result = this.calcEcpe(result);
                        break;
                    case _mp.MpCogInstrumentType.etmpre:
                        result = this.calcEtmpre(result)
                        break;
                    case _mp.MpCogInstrumentType.esalb:
                        result = this.calcEsalb(result);
                        break;
                    case _mp.MpCogInstrumentType.ecmspe:
                        result = this.calcEcmspe(result);
                        break;
                }

                //TODO: need to write a finally method for canceling saveinprogress
                this.dCtx.user.saveChanges()
                    .then(() => {
                        this.$mi.close(result);
                    })
                    .catch((error) => {
                        this.c.swal(swalSettings);
                        return null;
                    });
                }
            });
    }

    private pagerSort(a: IAssessPager, b: IAssessPager) {
        if (a.pageId < b.pageId) return -1;
        if (a.pageId === b.pageId) return 0;
        if (a.pageId > b.pageId) return 1;
    }

    private calcEtmpre(result: ecat.entity.ICogEtmpreResult): ecat.entity.ICogEtmpreResult {
        let creator = 0;
        let advancer = 0;
        let refiner = 0;
        let executor = 0;

        this.inventoryList.forEach(inv => {
            switch (inv.itemType) {
                case _mp.MpCogETMPREInvType.spont:
                    creator += inv.response.itemScore;
                    advancer += inv.response.itemScore;
                    break;
                case _mp.MpCogETMPREInvType.norm:
                    advancer += inv.response.itemScore;
                    executor += inv.response.itemScore;
                    break;
                case _mp.MpCogETMPREInvType.meth:
                    refiner += inv.response.itemScore;
                    executor += inv.response.itemScore;
                    break;
                case _mp.MpCogETMPREInvType.conc:
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

        //BCAT works more like this:
        let uniqueArray = [creator, advancer, refiner, executor].getUnique().sort();
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

    private calcEcpe(result: ecat.entity.ICogEcpeResult): ecat.entity.ICogEcpeResult {
        let totalScore = 0;
        let scoredItems = this.inventoryList.filter(inv => inv.isScored === true);

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

    private calcEsalb(result: ecat.entity.ICogEsalbResult): ecat.entity.ICogEsalbResult {
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

        this.inventoryList.forEach(inv => {
            switch (inv.itemType) {
                case _mp.MpCogESALBInvType.lais:
                    laissezFaire += inv.response.itemScore;
                    lzNum += 1;
                    break;
                case _mp.MpCogESALBInvType.man:
                    management += inv.response.itemScore;
                    manNum += 1;
                    break;
                case _mp.MpCogESALBInvType.cont:
                    contingent += inv.response.itemScore;
                    conNum += 1;
                    break;
                case _mp.MpCogESALBInvType.ideal:
                    idealized += inv.response.itemScore;
                    idealNum += 1;
                    break;
                case _mp.MpCogESALBInvType.inspir:
                    inspirational += inv.response.itemScore;
                    inspirNum += 1;
                    break;
                case _mp.MpCogESALBInvType.intellect:
                    intellectualStim += inv.response.itemScore;
                    intelNum += 1;
                    break;
                case _mp.MpCogESALBInvType.indiv:
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
    private calcEcmspe(result: ecat.entity.ICogEcmspeResult): ecat.entity.ICogEcmspeResult {
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

        this.inventoryList.forEach(inv => {
            switch (inv.itemType) {
                case _mp.MpCogECMSPEInvType.compete:
                    compete += inv.response.itemScore;
                    competeNum += 1;
                    break;
                case _mp.MpCogECMSPEInvType.collab:
                    collab += inv.response.itemScore;
                    collabNum += 1;
                    break;
                case _mp.MpCogECMSPEInvType.accom:
                    accom += inv.response.itemScore;
                    accomNum += 1;
                    break;
                case _mp.MpCogECMSPEInvType.avoid:
                    avoid += inv.response.itemScore;
                    avoidNum += 1;
                    break;
                case _mp.MpCogECMSPEInvType.compro:
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

const enum CogAssessViews {
    Loading,
    ECPE,
    ESALBECMSPE,
    ETMPRE
}*/