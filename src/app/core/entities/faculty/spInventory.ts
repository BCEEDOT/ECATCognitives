import { EntityBase } from '../EntityBase';
import { SpResponse } from './SpResponse';
import { SpInstrument } from './SpInstrument';

/// <code-import> Place custom imports between <code-import> tags
import * as mapEnum from '../../common/mapEnum';
import * as mapStrings from '../../common/mapStrings'
import * as staticData from '../../common/static'
import { SpResult } from './spResult';
import { FacSpResponse } from './facSpResponse';
/// </code-import>

export class SpInventory extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   instrumentId: number;
   displayOrder: number;
   isDisplayed: boolean;
   behavior: string;
   modifiedById: number;
   modifiedDate: Date;
   instrument: SpInstrument;
   

   /// <code> Place custom code between <code> tags
   private displayed = true;
   private freqLevel: mapEnum.SpFreqLevel = null;
   private effLevel: mapEnum.SpEffectLevel = null;
   private resultBreakout: any;
   private commentText: string;
   itemResponses: FacSpResponse[];
   /// </code>

   get compositeScore(): number {
        return this.responseForAssessee ? this.responseForAssessee.itemModelScore : null;
    };

    rejectChanges(): void {
        this.responseForAssessee.entityAspect.rejectChanges();
        this.effLevel = null;
        this.freqLevel = null;
        this.behaveDisplayed = true;//this.behaveDisplayed;
        // if (this.behaveDisplayed === true) {
        //     this.calculateItemResponse();
        // }
    }

    resetAssess(): void {
        this.effLevel = null;
        this.freqLevel = null;
        this.behaveDisplayed = true;
        this.responseForAssessee = null;
    }

    resetResult(): void {
        this.resultBreakout = null;
    }

    spResult: SpResult;
    responseForAssessee: FacSpResponse = null;

    get behaviorFreq(): mapEnum.SpFreqLevel {
        if (!this.responseForAssessee) {
            return null;
        }
        if (!this.responseForAssessee.mpItemResponse) {
            return this.freqLevel;
        }
        switch (this.responseForAssessee.mpItemResponse) {
            case mapStrings.MpSpItemResponse.hea:
            case mapStrings.MpSpItemResponse.iea:
            case mapStrings.MpSpItemResponse.ea:
                return mapEnum.SpFreqLevel.Always;

            case mapStrings.MpSpItemResponse.heu:
            case mapStrings.MpSpItemResponse.eu:
            case mapStrings.MpSpItemResponse.ieu:
                return mapEnum.SpFreqLevel.Usually;
            default:
                return null;
        }
    }

    set behaviorFreq(freqLevel: mapEnum.SpFreqLevel) {
        this.displayed = true;
        this.freqLevel = freqLevel;
        this.calculateItemResponse();
    }

    get behaviorEffect(): mapEnum.SpEffectLevel {
        if (!this.responseForAssessee) {
            return null;
        }
        if (!this.responseForAssessee.mpItemResponse) {
            return this.effLevel;
        }
        switch (this.responseForAssessee.mpItemResponse) {
            case mapStrings.MpSpItemResponse.hea:
            case mapStrings.MpSpItemResponse.heu:
                return mapEnum.SpEffectLevel.HighlyEffective;
            case mapStrings.MpSpItemResponse.eu:
            case mapStrings.MpSpItemResponse.ea:
                return mapEnum.SpEffectLevel.Effective;
            case mapStrings.MpSpItemResponse.iea:
            case mapStrings.MpSpItemResponse.ieu:
                return mapEnum.SpEffectLevel.Ineffective;
            default:
                return null;
        }
    }

    set behaviorEffect(effLevel: mapEnum.SpEffectLevel) {
        this.displayed = true;
        this.effLevel = effLevel;
        this.calculateItemResponse();
    }

    get behaveDisplayed(): boolean {
        if (!this.responseForAssessee) {
            return null;
        }
        if (!this.responseForAssessee.mpItemResponse) {
            return this.displayed;
        }
        return this.responseForAssessee.mpItemResponse !== mapStrings.MpSpItemResponse.nd;
    }

    set behaveDisplayed(behaveDisplayed: boolean) {

        this.displayed = behaveDisplayed;

        if (behaveDisplayed) {
            this.freqLevel = this.effLevel = null;
            this.responseForAssessee.mpItemResponse = null;
            this.calculateItemResponse();
            //this.compositeScore;
        } else {
            this.responseForAssessee.mpItemResponse = mapStrings.MpSpItemResponse.nd;
            this.responseForAssessee.itemModelScore = mapEnum.CompositeModelScore.nd;
        }
    }

    private calculateItemResponse(): void {
        const reponse = this.responseForAssessee.mpItemResponse;
        if (reponse) {
            if (!this.effLevel) this.effLevel = this.behaviorEffect;
            if (!this.freqLevel) this.freqLevel = this.behaviorFreq;
        }


        if (!this.effLevel || !this.freqLevel) {
            this.responseForAssessee.mpItemResponse = null;
            return;
        }

        switch (this.effLevel) {

            case mapEnum.SpEffectLevel.HighlyEffective:
                if (this.freqLevel === mapEnum.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = mapStrings.MpSpItemResponse.hea;
                    this.responseForAssessee.itemModelScore = mapEnum.CompositeModelScore.hea;
                } else {
                    this.responseForAssessee.mpItemResponse = mapStrings.MpSpItemResponse.heu;
                    this.responseForAssessee.itemModelScore  = mapEnum.CompositeModelScore.heu;
                }
                break;

            case mapEnum.SpEffectLevel.Effective:
                if (this.freqLevel === mapEnum.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = mapStrings.MpSpItemResponse.ea;
                    this.responseForAssessee.itemModelScore  = mapEnum.CompositeModelScore.ea;
                } else {
                    this.responseForAssessee.mpItemResponse = mapStrings.MpSpItemResponse.eu;
                    this.responseForAssessee.itemModelScore  = mapEnum.CompositeModelScore.eu;
                }
                break;

            case mapEnum.SpEffectLevel.Ineffective:
                if (this.freqLevel === mapEnum.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = mapStrings.MpSpItemResponse.iea;
                    this.responseForAssessee.itemModelScore  = mapEnum.CompositeModelScore.iea;
                } else {
                    this.responseForAssessee.mpItemResponse = mapStrings.MpSpItemResponse.ieu;
                    this.responseForAssessee.itemModelScore  = mapEnum.CompositeModelScore.ieu;
                }
                break;

            default:
                this.responseForAssessee.mpItemResponse = null;
                this.responseForAssessee.itemModelScore = null;
        }


    }

    get behaviorEllipse(): string {
        if (this.behavior) {
            return this.behavior.substr(0, 50);
        }
        return null;
    }

    get abbrivateText(): string {
        if (this.commentText) return this.commentText.substr(30);
        return null;
    }

    // get resultBreakOut(): any {
    //     if (this.resultBreakOut) {
    //         return this.resultBreakOut;
    //     }

    //     if (!this.spResult) {
    //         return null;
    //     }

    //     const breakOut = {
    //         selfResult: '',
    //         peersResult: '',
    //         facultyResult: '',
    //         peerBoChart: []
    //     }

    //     //TODO: 
    //     //const responsesForItem = this.spResult.sanitizedResponses.filter(response => response.inventoryItemId === this.id);

    //     const compositeBreakOut = {};

    //     /*responsesForItem
    //         .filter(response => !response.isSelfResponse)
    //         .forEach(response => {
    //             if (compositeBreakOut[response.mpItemResponse]) {
    //                 compositeBreakOut[response.mpItemResponse] += 1;
    //             } else {
    //                 compositeBreakOut[response.mpItemResponse] = 1;
    //             }
    //         });*/

    //     const dataSet = [];

    //     for (let bo in compositeBreakOut) {
    //         if (compositeBreakOut.hasOwnProperty(bo)) {
    //             if (bo === 'IEA') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#AA0000' });
    //             if (bo === 'IEU') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#FE6161' });
    //             if (bo === 'ND') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#AAAAAA' });
    //             if (bo === 'EA') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#00AA58' });
    //             if (bo === 'EU') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#73FFBB' });
    //             if (bo === 'HEA') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#00308F' });
    //             if (bo === 'HEU') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#7CA8FF' });
    //         }
    //     }

    //     //TODO: fix staticData stuff, default class export doesn't seem to be working
    //     breakOut.peerBoChart = dataSet;
    //     //breakOut.peersResult = staticData.breakDownCalculation(compositeBreakOut);

    //     //const selfResponse = responsesForItem.filter(response => response.isSelfResponse && response.inventoryItemId === this.id)[0];
    //     //const facResponse = (this.spResult.facultyResponses) ? //this.spResult.facultyResponses.filter(response => response["InventoryItemId"] === this.id)[0] : null;

    //     //breakOut.selfResult = staticData.prettifyItemResponse(selfResponse.mpItemResponse);
    //     //breakOut.facultyResult = (facResponse) ? staticData.prettifyItemResponse(facResponse["MpItemResponse"]) : 'Not Assessed';
       
    //     this.resultBreakout = breakOut;
    //     return breakOut;
    // }

}

