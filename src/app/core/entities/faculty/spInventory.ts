import { EntityBase } from '../EntityBase';
import { SpResponse } from './SpResponse';
import { SpInstrument } from './SpInstrument';

/// <code-import> Place custom imports between <code-import> tags
import * as mapEnum from '../../common/mapEnum';
import * as mapStrings from '../../common/mapStrings'
import * as staticData from '../../common/static'
import { SpResult } from './SpResult';
import { FacSpResponse } from "./FacSpResponse";
import { WorkGroup } from "./WorkGroup";
import { CrseStudentInGroup } from "./CrseStudentInGroup";
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
   private facSpResultForStudent: any;
   private commentText: string;
   itemResponses: SpResponse[] | FacSpResponse[];
   workGroup: WorkGroup;
   

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
        this.displayed = true;
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

    resetResults(): void {
        this.facSpResultForStudent = null;
    }

    //get behaveResultForStudent(): ecat.entity.ext.IBehaveResultForStud {
    get behaveResultForStudent(): any {
        if (this.facSpResultForStudent) return this.facSpResultForStudent;
        if (!this.workGroup) return null;

        const groupMembers = this.workGroup.groupMembers.sort(this.sortPeersByLastName);
        const facResponseForThisItem = this.workGroup.facSpResponses.filter(response => response.inventoryItemId === this.id);

        groupMembers.forEach((gm, gmIdx, gmArray) => {
            const current = {} as any;
            const givenBo = {
                ['IEA']: 0,
                ['IEU']: 0,
                ['ND']: 0,
                ['EU']: 0,
                ['EA']: 0,
                ['HEU']: 0,
                ['HEA']: 0
            };
            const receivedBo = {
                ['Highly Effective']: 0,
                ['Effective']: 0,
                ['Not Displayed']: 0,
                ['Ineffective']: 0
            };
            // const receivedBo = {
            //     ['IEA']: 0,
            //     ['IEU']: 0,
            //     ['ND']: 0,
            //     ['EU']: 0,
            //     ['EA']: 0,
            //     ['HEU']: 0,
            //     ['HEA']: 0
            // };
            //const selfBo = {};
            const givenResp = [];
            const rcvdResp = [];

            gm.assesseeSpResponses
                .filter(response => response.inventoryItemId === this.id &&
                    response.assesseePersonId === response.assessorPersonId)
                .forEach(response => {
                    // if (selfBo[response.mpItemResponse]) selfBo[response.mpItemResponse] += 1;
                    // if (!selfBo[response.mpItemResponse]) selfBo[response.mpItemResponse] = 1;
                    current.selfOutcome = staticData.EcLocalDataService.prettifyItemResponse(response.mpItemResponse);
                });

            gm.assesseeSpResponses
                .filter(response => response.inventoryItemId === this.id &&
                    response.assesseePersonId !== response.assessorPersonId)
                .forEach(response => {
                    rcvdResp.push({ name: response.assessor.studentProfile.person.lastName, itemResp: response.mpItemResponse, score: response.itemModelScore, color: '#000000' });
                    // if (receivedBo[response.mpItemResponse]) receivedBo[response.mpItemResponse] += 1;
                    // if (!receivedBo[response.mpItemResponse]) receivedBo[response.mpItemResponse] = 1;
                    switch (response.itemModelScore) {
                        case mapEnum.CompositeModelScore.iea:
                        case mapEnum.CompositeModelScore.ieu:
                            if(receivedBo['Ineffective']) {receivedBo['Ineffective'] += 1};
                            if(!receivedBo['Ineffective']) {receivedBo['Ineffective'] = 1};
                            break;
                        case mapEnum.CompositeModelScore.nd:
                            if(receivedBo['Not Displayed']) {receivedBo['Not Displayed'] += 1};
                            if(!receivedBo['Not Displayed']) {receivedBo['Not Displayed'] = 1};
                            break;
                        case mapEnum.CompositeModelScore.eu:
                        case mapEnum.CompositeModelScore.ea:
                                if(receivedBo['Effective']) {receivedBo['Effective'] += 1};
                            if(!receivedBo['Effective']) {receivedBo['Effective'] = 1};
                            break;
                        case mapEnum.CompositeModelScore.heu:
                        case mapEnum.CompositeModelScore.hea:
                            if(receivedBo['Highly Effective']) {receivedBo['Highly Effective'] += 1};
                            if(!receivedBo['Highly Effective']) {receivedBo['Highly Effective'] = 1};
                            break;
                    }
                });

            gm.assessorSpResponses
                .filter(response => response.inventoryItemId === this.id &&
                    response.assesseePersonId !== response.assessorPersonId)
                .forEach(response => {
                    givenResp.push({ name: response.assessee.studentProfile.person.lastName, itemResp: response.mpItemResponse, score: response.itemModelScore, color: '#000000' });
                    if (givenBo[response.mpItemResponse]) givenBo[response.mpItemResponse] += 1;
                    if (!givenBo[response.mpItemResponse]) givenBo[response.mpItemResponse] = 1;

                });

            const facResponse = facResponseForThisItem.filter(response => response.assesseePersonId === gm.studentId)[0];
            // current.selfOutcome = _staticDs.breakDownCalculation(selfBo);
            // current.gvnOutcome = _staticDs.breakDownCalculation(givenBo);
            // current.rcvdOutcome = _staticDs.breakDownCalculation(receivedBo);
            current.facOutcome = (facResponse) ? staticData.EcLocalDataService.prettifyItemResponse(facResponse.mpItemResponse) : 'Not Assessed';

            givenResp.forEach(resp => {
                switch (resp.itemResp) {
                    case 'IEA': resp.color = '#AA0000'; break;
                    case 'IEU': resp.color = '#FE6161'; break;
                    case 'ND': resp.color = '#AAAAAA'; break;
                    case 'EA': resp.color = '#00AA58'; break;
                    case 'EU': resp.color = '#73FFBB'; break;
                    case 'HEA': resp.color = '#00308F'; break;
                    case 'HEU': resp.color = '#7CA8FF'; break;
                }
            });
            rcvdResp.forEach(resp => {
                switch (resp.itemResp) {
                    case 'IEA': resp.color = '#AA0000'; break;
                    case 'IEU': resp.color = '#FE6161'; break;
                    case 'ND': resp.color = '#AAAAAA'; break;
                    case 'EA': resp.color = '#00AA58'; break;
                    case 'EU': resp.color = '#73FFBB'; break;
                    case 'HEA': resp.color = '#00308F'; break;
                    case 'HEU': resp.color = '#7CA8FF'; break;
                }
            });

            current.respByBehav = {
                gvnResp: givenResp,
                rcvdResp: rcvdResp
            }

            const recDataset = [];

            for (let bo in receivedBo) {
                if (receivedBo.hasOwnProperty(bo)) {
                    recDataset.push({ name: bo, value: receivedBo[bo] });
                    // if (bo === 'IEA') recDataset.push({ data: receivedBo[bo], label: bo, color: '#AA0000' });
                    // if (bo === 'IEU') recDataset.push({ data: receivedBo[bo], label: bo, color: '#FE6161' });
                    // if (bo === 'ND') recDataset.push({ data: receivedBo[bo], label: bo, color: '#AAAAAA' });
                    // if (bo === 'EA') recDataset.push({ data: receivedBo[bo], label: bo, color: '#00AA58' });
                    // if (bo === 'EU') recDataset.push({ data: receivedBo[bo], label: bo, color: '#73FFBB' });
                    // if (bo === 'HEA') recDataset.push({ data: receivedBo[bo], label: bo, color: '#00308F' });
                    // if (bo === 'HEU') recDataset.push({ data: receivedBo[bo], label: bo, color: '#7CA8FF' });
                }
            }
            //current.receivedBo = recDataset;
            current.receivedBo = [ { "name": "# Recieved", "series": recDataset }];

            const gvnDataset = [];

            for (let bo in givenBo) {
                if (givenBo.hasOwnProperty(bo)) {
                    gvnDataset.push({ name: bo, value: givenBo[bo] });
                    // if (bo === 'IEA') gvnDataset.push({ data: givenBo[bo], label: bo, color: '#AA0000' });
                    // if (bo === 'IEU') gvnDataset.push({ data: givenBo[bo], label: bo, color: '#FE6161' });
                    // if (bo === 'ND') gvnDataset.push({ data: givenBo[bo], label: bo, color: '#AAAAAA' });
                    // if (bo === 'EA') gvnDataset.push({ data: givenBo[bo], label: bo, color: '#00AA58' });
                    // if (bo === 'EU') gvnDataset.push({ data: givenBo[bo], label: bo, color: '#73FFBB' });
                    // if (bo === 'HEA') gvnDataset.push({ data: givenBo[bo], label: bo, color: '#00308F' });
                    // if (bo === 'HEU') gvnDataset.push({ data: givenBo[bo], label: bo, color: '#7CA8FF' });
                }
            }
            current.givenBo = [ { "name": "# Given", "series": gvnDataset }];

            if (this.facSpResultForStudent) {
                this.facSpResultForStudent[gm.studentId] = current;
            } else {
                this.facSpResultForStudent = {} as any;
                this.facSpResultForStudent[gm.studentId] = current;
            }
        });
        return this.facSpResultForStudent;
    };

    private sortPeersByLastName(a: CrseStudentInGroup, b: CrseStudentInGroup) {
        if (a.studentProfile.person.lastName < b.studentProfile.person.lastName) return -1;
        if (a.studentProfile.person.lastName > b.studentProfile.person.lastName) return 1;
        if (a.studentProfile.person.lastName === b.studentProfile.person.lastName) {
            if (a.studentProfile.person.firstName < b.studentProfile.person.firstName) return -1;
            if (a.studentProfile.person.firstName < b.studentProfile.person.firstName) return 1;
        };
        return 0;
    }
/// </code>
}

