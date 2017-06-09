import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { QueryResult} from 'breeze-client';
import { CogEcmspeResult, CogEcpeResult, CogEsalbResult, CogEtmpreResult } from "../core/entities/user";
import { GlobalService } from "../core/services/global.service";
import { UserDataContext } from "../core/services/data/user-data-context.service";
import { CogResultsService } from "./services/cog-results.service";
import * as _mp from "../core/common/mapStrings";

@Component({
  //Selector only needed if another template is going to refernece
  selector: 'qs-cognitives',
  templateUrl: './cognitives.component.html',
  styleUrls: ['./cognitives.component.scss']
  //Limits only to current view and not children
  //viewProviders: [ UsersService ],
})
export class CognitivesComponent implements OnInit {

    protected ecpeResult: CogEcpeResult;
    protected etmpreResult: CogEtmpreResult;
    protected esalbResult: CogEsalbResult;
    protected ecmspeResult: CogEcmspeResult;

    protected view = {
        list: CogViews.List,
        ecpe: CogViews.ECPE,
        etmpre: CogViews.ETMPRE,
        esalb: CogViews.ESALB,
        ecmspe: CogViews.ECMSPE
    }

    protected cogType = _mp.MpCogInstrumentType;


  constructor(private titleService: Title,
    private router: Router,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    private userDataContext: UserDataContext,
    public media: TdMediaService,
    private global: GlobalService,
    private cogResultsService: CogResultsService) { }

  goBack(route: string): void {
    this.router.navigate(['/']);
  }
 
  ngOnInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.titleService.setTitle('Cognitives');
    this.activate();
  }

  activate(force?: boolean): void {
    //maps to ng-template tag
    this.loadingService.register('cognitives.list');

    const that = this;

    this.userDataContext.getCogResults (false, force )
        .then(res => getCogResultsResponse(res))
        .catch(e => {
          this.loadingService.resolve('cognitives.list');
          console.log('error getting cognitives');
          console.log(e);
        })

  function getCogResultsResponse(result: Array<any>) {
//RICKY
//console.log(result);
            if (result.length !== null) {
                result.forEach(res => {
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.ecpe) 
                    {
                        that.cogResultsService.cogEcpeResult(res);
                        that.ecpeResult = res;
                        //that.calcEcpeResult();
                    }
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.etmpre) 
                    { 
                        that.etmpreResult = res; 
                    }
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.esalb) 
                    { 
                        that.esalbResult = res; 
                    }
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.ecmspe) 
                    { 
                        that.ecmspeResult = res; 
                    }
                });
            }
//RICKY
//console.log(that.ecpeResult);      
        }

    
  }//end activate



/*    takeAssess(selType: string): void {
        let assessModalOption: angular.ui.bootstrap.IModalSettings = {
            controller: cogAssess.controllerId,
            controllerAs: 'cogAssess',
            bindToController: true,
            keyboard: false,
            backdrop: 'static',
            templateUrl: '@[appCore]/feature/cog/assess.html'
        };

        //let prevAttempt = (this[`${type}Result`]) ? this[`${type}Result`].attempt : 0;
        var prevAttempt: number;
        switch (selType) {
            case _mp.MpCogInstrumentType.ecpe:
                prevAttempt = (this.ecpeResult) ? this.ecpeResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.ecpeResult = res;
                        this.calcEcpeResult();
                        $('<style>#ecpeGraph:after{left:' + this.ecpeLine + '%}</style>').appendTo('head');
                        this.activeView = this.view.ecpe;
                    }
                });
                break;
            case _mp.MpCogInstrumentType.etmpre:
                prevAttempt = (this.etmpreResult) ? this.etmpreResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.etmpreResult = res;
                        this.activeView = this.view.etmpre;
                    }
                });
                break;
            case _mp.MpCogInstrumentType.esalb:
                prevAttempt = (this.esalbResult) ? this.esalbResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.esalbResult = res;
                        this.activeView = this.view.esalb;
                    }
                });
                break;
            case _mp.MpCogInstrumentType.ecmspe:
                prevAttempt = (this.ecmspeResult) ? this.ecmspeResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.ecmspeResult = res;
                        this.activeView = this.view.ecmspe;
                    }
                });
                break;
            default:
                return null;
        }
    }*/


}//end CognitivesComponent

const enum CogViews {
    List,
    ECPE,
    ETMPRE,
    ESALB,
    ECMSPE
}


/*import ICommon from "core/common/commonService"
import IDataCtx from 'core/service/data/context'
import * as _mp from "core/common/mapStrings"
import _swal from "sweetalert"
import cogAssess from 'core/feature/cog/assess'

export default class EcCogHome {
    static controllerId = 'app.core.cog.home';
    static $inject = ['$scope', '$uibModal', ICommon.serviceId, IDataCtx.serviceId];

    protected ecpeResult: ecat.entity.s.cog.CogEcpeResult;
    protected etmpreResult: ecat.entity.s.cog.CogEtmpreResult;
    protected esalbResult: ecat.entity.s.cog.CogEsalbResult;
    protected ecmspeResult: ecat.entity.s.cog.CogEcmspeResult;

    private activeView: number;
    protected view = {
        list: CogViews.List,
        ecpe: CogViews.ECPE,
        etmpre: CogViews.ETMPRE,
        esalb: CogViews.ESALB,
        ecmspe: CogViews.ECMSPE
    }

    protected cogType = _mp.MpCogInstrumentType;
    //TODO: Update eCPE mean and Standard Deviation values periodically based on new assessment data
    private ecpeMean = 473;
    private ecpeSD = 124;
    private ecpeLine = 49.9;

    constructor(private $scope: angular.IScope, private $uim: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        this.activeView = this.view.list;
        this.activate();
    }

    activate(force?: boolean): void {
        const that = this;

        this.dCtx.user.getCogResults(false, force)
            .then(getCogResultsResponse);

        function getCogResultsResponse(results: Array<any>) {
            if (results.length !== null) {
                results.forEach(res => {
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.ecpe) {
                        that.ecpeResult = res;
                        that.calcEcpeResult();
                        //jQuery to modify the :after psuedo-element we are using to drop our ECPE Result line
                        $('<style>#ecpeGraph:after{left:'+ that.ecpeLine +'%}</style>').appendTo('head');
                    }
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.etmpre) { that.etmpreResult = res; }
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.esalb) { that.esalbResult = res; }
                    if (res.instrument.mpCogInstrumentType === _mp.MpCogInstrumentType.ecmspe) { that.ecmspeResult = res; }
                });
            }
        }
    }

    takeAssess(selType: string): void {
        let assessModalOption: angular.ui.bootstrap.IModalSettings = {
            controller: cogAssess.controllerId,
            controllerAs: 'cogAssess',
            bindToController: true,
            keyboard: false,
            backdrop: 'static',
            templateUrl: '@[appCore]/feature/cog/assess.html'
        };

        //let prevAttempt = (this[`${type}Result`]) ? this[`${type}Result`].attempt : 0;
        var prevAttempt: number;
        switch (selType) {
            case _mp.MpCogInstrumentType.ecpe:
                prevAttempt = (this.ecpeResult) ? this.ecpeResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.ecpeResult = res;
                        this.calcEcpeResult();
                        $('<style>#ecpeGraph:after{left:' + this.ecpeLine + '%}</style>').appendTo('head');
                        this.activeView = this.view.ecpe;
                    }
                });
                break;
            case _mp.MpCogInstrumentType.etmpre:
                prevAttempt = (this.etmpreResult) ? this.etmpreResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.etmpreResult = res;
                        this.activeView = this.view.etmpre;
                    }
                });
                break;
            case _mp.MpCogInstrumentType.esalb:
                prevAttempt = (this.esalbResult) ? this.esalbResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.esalbResult = res;
                        this.activeView = this.view.esalb;
                    }
                });
                break;
            case _mp.MpCogInstrumentType.ecmspe:
                prevAttempt = (this.ecmspeResult) ? this.ecmspeResult.attempt : 0;
                assessModalOption.resolve = {
                    cogType: function () { return selType },
                    prevAttempt: function () { return prevAttempt }
                }

                this.$uim.open(assessModalOption).result.then(res => {
                    if (res !== null) {
                        this.ecmspeResult = res;
                        this.activeView = this.view.ecmspe;
                    }
                });
                break;
            default:
                return null;
        }
    }

    private calcEcpeResult(): void {
        let distMove = 0;
        if (this.ecpeResult.outcome < this.ecpeMean) {
            //Strongly Adaptive
            if (this.ecpeResult.outcome <= (this.ecpeMean - (this.ecpeSD * 2))) {
                //figure out how far into strongly adaptive percentage wise we are
                //we will be further to the left of 2 standard deviations from the mean
                distMove = this.ecpeResult.outcome / (this.ecpeMean - (this.ecpeSD * 2));
                //each section on the graph is ~16.5% of the image, so place our line into that block
                this.ecpeLine = 16.5 * distMove;
            //Moderately Adaptive
            } else if (this.ecpeResult.outcome <= (this.ecpeMean - this.ecpeSD)) {
                //we will be between 2 and 1 standard deviations from the mean
                distMove = (this.ecpeResult.outcome - (this.ecpeMean - (this.ecpeSD * 2))) / this.ecpeSD;
                //figure how far into a 16.5% block of the image we are
                distMove = 16.5 * distMove;
                //put the line that much into a 16.5% block of the image, starting at 16.6%  of the image (to avoid dropping right on the image's line)
                this.ecpeLine = 16.6 + distMove;
            //Mildly Adaptive
            } else {
                //we will be within 1 standard deviation of the mean
                distMove = (this.ecpeResult.outcome - (this.ecpeMean - this.ecpeSD)) / this.ecpeSD;
                distMove = 16.5 * distMove;
                this.ecpeLine = 33.4 + distMove;
            }
        } else if (this.ecpeResult.outcome > this.ecpeMean) {
            if (this.ecpeResult.outcome < (this.ecpeMean + this.ecpeSD)) {
                distMove = (this.ecpeResult.outcome - this.ecpeMean) / this.ecpeSD;
                distMove = 16.5 * distMove;
                this.ecpeLine = 50 + distMove;
            } else if (this.ecpeResult.outcome < (this.ecpeMean + (this.ecpeSD * 2))) {
                distMove = (this.ecpeResult.outcome - (this.ecpeMean + this.ecpeSD)) / this.ecpeSD;
                distMove = 16.5 * distMove;
                this.ecpeLine = 66.6 + distMove;
            } else {
                distMove = (this.ecpeResult.outcome - (this.ecpeMean + (this.ecpeSD * 2))) / (1000 - (this.ecpeMean + (this.ecpeSD * 2)));
                distMove = 16.5 * distMove;
                this.ecpeLine = 83.2 + distMove;
            }
        }
    }
}

const enum CogViews {
    List,
    ECPE,
    ETMPRE,
    ESALB,
    ECMSPE
}*/

