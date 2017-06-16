import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacSpComment } from './FacSpComment';
import { SpResponse } from './SpResponse';
import { WorkGroup } from './WorkGroup';
import { FacSpResponse } from './FacSpResponse';
import { FacStratResponse } from './FacStratResponse';
import { StudSpComment } from './StudSpComment';
import { SpResult } from './SpResult';
import { StratResponse } from './StratResponse';
import { StratResult } from './StratResult';
import { StudentInCourse } from './StudentInCourse';
import { ProfileStudent } from './ProfileStudent';

/// <code-import> Place custom imports between <code-import> tags
import { EcLocalDataService } from "../../common/static";
import * as mp from "../../common/mapStrings"

/*interface ICrseStudInGrpStatus {
    assessComplete: boolean;
    stratComplete: boolean;
    missingAssessItems: Array<number>;
    //breakout: ISpStatusBreakOut;
    //gaveBreakOut: ISpGaveStatusBreakOut;
    breakOutChartData: Array<any>;
    gaveBreakOutChartData: Array<any>;
    compositeScore: number;
    gaveCompositeScore: number;
    stratedPosition: number;
    hasComment: boolean;
}

interface ISpGaveStatusBreakOut {
    gaveHE: number;
    gaveE: number;
    gaveIE: number;
    gaveND: number;
}

interface ISpStatusBreakOut {
    HE: number;
    E: number;
    IE: number;
    ND: number;
}*/
/// </code-import>

export class CrseStudentInGroup extends EntityBase {
   // Generated code. Do not place code below this line.
   studentId: number;
   courseId: number;
   workGroupId: number;
   hasAcknowledged: boolean;
   bbCrseStudGroupId: string;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   modifiedById: number;
   modifiedDate: Date;
   assesseeSpResponses: SpResponse[];
   assesseeStratResponse: StratResponse[];
   assessorSpResponses: SpResponse[];
   assessorStratResponse: StratResponse[];
   authorOfComments: StudSpComment[];
   course: Course;
   facultyComment: FacSpComment;
   facultySpResponses: FacSpResponse[];
   facultyStrat: FacStratResponse;
   recipientOfComments: StudSpComment[];
   spResult: SpResult;
   stratResult: StratResult;
   studentInCourse: StudentInCourse;
   studentProfile: ProfileStudent;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags

    stratIsValid: boolean;
    stratValidationErrors: Array<{ cat: string, text: string }>;
    proposedStratPosition: number = null;

    numOfStratIncomplete = null;
    numberOfAuthorComments = null;
    //statusOfStudent: any;

   constructor() {
       super();
   }

    protected sop: any;
    protected sos: any;

   get rankName(): string {
        let _salutation: string;
        const p = (this.studentProfile) ? this.studentProfile.person : null;
        if (p && !_salutation) _salutation = EcLocalDataService.getSalutation(p.mpPaygrade, p.mpComponent, p.mpAffiliation);
        
        return (!p) ? 'Unk' : `${_salutation} ${this.studentProfile.person.lastName}, ${this.studentProfile.person.firstName}`;
    }

    get statusOfPeer(): any {
        if (!this.workGroup) {
            return null;
        }
        if (this.sop) {
            return this.sop;
        }
        this.sop = {};
        this.updateStatusOfPeer();
        return this.sop;
    }

    get statusOfStudent(): any {
        if (!this.workGroup){
            return null;
        }
        if (this.sos) {
            return this.sos;
        }
        this.sos = {};
        this.updateStatusOfStudent();
        return this.sos;

    }

    updateStatusOfPeer(): any {
        if (!this.sop) this.sop = {};
        const groupMembers = this.workGroup.groupMembers.filter(gm => !gm.entityAspect.entityState.isDetached());

        groupMembers.forEach((gm) => {
            let cummScore = 0;

            const sigStatus: any = {
                assessComplete: false,
                stratComplete: false,
                isPeerAllComplete: false,
                missingAssessItems: [],
                breakout: { IE: 0, ND: 0, E: 0, HE: 0 },
                breakOutChartData: [],
                compositeScore: 0,
                stratedPosition: null,
                hasComment: false
            }

            const peerStrat = gm.assesseeStratResponse
                .filter(strat => strat.assessorPersonId === this.studentId &&
                    strat.assesseePersonId === gm.studentId &&
                    !!strat.stratPosition)[0];

            sigStatus.stratComplete = !!peerStrat;

            sigStatus.stratedPosition = (sigStatus.stratComplete) ? peerStrat.stratPosition : null;

            sigStatus.hasComment = !!gm.recipientOfComments
                .filter(comment => comment.authorPersonId === this.studentId &&
                    comment.recipientPersonId === gm.studentId)[0];

            const knownReponse = mp.MpSpItemResponse;

            const responseList = gm.assesseeSpResponses
                .filter(response => response.assessorPersonId === this.studentId &&
                    response.assesseePersonId === gm.studentId);

            responseList.forEach(response => {

                switch (response.mpItemResponse) {

                    case knownReponse.iea:
                        sigStatus.breakout.IE += 1;
                        cummScore += 0;
                        break;
                    case knownReponse.ieu:
                        sigStatus.breakout.IE += 1;
                        cummScore += 1;
                        break;
                    case knownReponse.nd:
                        cummScore += 2;
                        sigStatus.breakout.ND += 1;
                        break;
                    case knownReponse.eu:
                        cummScore += 3;
                        sigStatus.breakout.E += 1;
                        break;
                    case knownReponse.ea:
                        cummScore += 4;
                        sigStatus.breakout.E += 1;
                        break;
                    case knownReponse.heu:
                        cummScore += 5;
                        sigStatus.breakout.HE += 1;
                        break;
                    case knownReponse.hea:
                        cummScore += 6;
                        sigStatus.breakout.HE += 1;
                        break;
                    default:
                        break;
                }
            });

            if (this.workGroup.assignedSpInstr) {
                this.workGroup
                    .assignedSpInstr
                    .inventoryCollection
                    .forEach(inventoryItem => {
                        const hasResponse = responseList.some(response => response.inventoryItemId === inventoryItem.id);
                        if (!hasResponse) {
                            sigStatus.missingAssessItems.push(inventoryItem.id);
                        }
                    });

                cummScore = (cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6)) * 100;
                //sigStatus.compositeScore = parseFloat(cummScore.toFixed(2));
                sigStatus.compositeScore = Math.round(cummScore);
            }

            sigStatus.assessComplete = sigStatus.missingAssessItems.length === 0;

            sigStatus.isPeerAllComplete = sigStatus.assessComplete && sigStatus.stratComplete;

            const { HE, E, IE, ND } = sigStatus.breakout;

            sigStatus.breakOutChartData.push({ name: 'Highly Effective', value: HE });
            sigStatus.breakOutChartData.push({ name: 'Effective', value: E });
            sigStatus.breakOutChartData.push({ name: 'Not Displayed', value: ND });
            sigStatus.breakOutChartData.push({ name: 'Ineffective', value: IE });
            

            // sigStatus.breakOutChartData.push({ label: 'Highly Effective', data: HE, color: '#00308F' });
            // sigStatus.breakOutChartData.push({ label: 'Effective', data: E, color: '#00AA58' });
            // sigStatus.breakOutChartData.push({ label: 'Ineffective', data: IE, color: '#AA0000' });
            // sigStatus.breakOutChartData.push({ label: 'Not Display', data: ND, color: '#AAAAAA' });

            this.sop[gm.studentId.toString()] = sigStatus;
        });
        return this.sop;
    }

    //ecat.entity.ext.IFacCrseStudInGrpStatus
    updateStatusOfStudent(): any {

        if (!this.workGroup) {
            return null;
        }

        let cummScore = 0;
        let gaveCummScore = 0;
        const missingItems = [];
        let composite = null;
        let gaveComposite = null;
        const facResponses = this.workGroup.facSpResponses;
        const facComments = this.workGroup.facSpComments;
        const facStats = this.workGroup.facStratResponses;
        const bo = {//: ecat.entity.ext.ISpStatusBreakOut = {
            HE: null,
            IE: null,
            E: null,
            ND: null
        };

        const gaveBo = {//: ecat.entity.ext.ISpGaveStatusBreakOut = {
            gaveHE: null,
            gaveIE: null,
            gaveE: null,
            gaveND: null
        };

        const studStrat = facStats.filter(strat => strat.assesseePersonId === this.studentId && !!strat.stratPosition)[0];

        const stratComplete = !!studStrat;

        const stratedPosition = (stratComplete) ? studStrat.stratPosition : null;

        const spResponses = facResponses.filter(response => response.assesseePersonId === this.studentId);

        const hasComment = facComments.some(comment => comment.recipientPersonId === this.studentId);

        const knownReponse = mp.MpSpItemResponse;

        spResponses.forEach(response => {

            switch (response.mpItemResponse) {
            case knownReponse.iea:
                bo.IE += 1;
                cummScore += 0;
                break;
            case knownReponse.ieu:
                bo.IE += 1;
                cummScore += 1;
                break;
            case knownReponse.nd:
                cummScore += 2;
                bo.ND += 1;
                break;
            case knownReponse.eu:
                cummScore += 3;
                bo.E += 1;
                break;
            case knownReponse.ea:
                cummScore += 4;
                bo.E += 1;
                break;
            case knownReponse.heu:
                cummScore += 5;
                bo.HE += 1;
                break;
            case knownReponse.hea:
                cummScore += 6;
                bo.HE += 1;
                break;
            default:
                break;
            }
        });

        if (this.workGroup.assignedSpInstr) {
            this.workGroup
                .assignedSpInstr
                .inventoryCollection
                .forEach(inventoryItem => {
                    const hasResponse = spResponses.some(response => response.inventoryItemId === inventoryItem.id);
                    if (!hasResponse) {
                        missingItems.push(inventoryItem.id);
                    }
                });
            //Divide by 6 values instead of 7 so if all scores are IEA the outcome is 0 and HEA is 100. 
            composite = (cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6) * 100);
            composite = Math.round(composite);
        }

        const { HE, E, IE, ND } = bo;

        const chartData = [];
        chartData.push({ name: 'Highly Effective', value: HE });
        chartData.push({ name: 'Effective', value: E });
        chartData.push({ name: 'Not Displayed', value: ND });
        chartData.push({ name: 'Ineffective', value: IE });
        
        // chartData.push({ label: 'Highly Effective', data: HE, color: '#00308F' });
        // chartData.push({ label: 'Effective', data: E, color: '#00AA58' });
        // chartData.push({ label: 'Ineffective', data: IE, color: '#AA0000' });
        // chartData.push({ label: 'Not Display', data: ND, color: '#AAAAAA' });


        let totalMarkings = 0;
        let totalHe = 0;
        let totalE = 0;
        let totalIe = 0;
        let totalNd = 0;

        const peers = this.workGroup.groupMembers.filter(mem => mem.studentId !== this.studentId);

        peers.forEach((mem) => {
            const c = this.statusOfPeer[mem.studentId].breakout;
            const totalForPeer = c.E + c.HE + c.IE + c.ND;
            totalMarkings += totalForPeer;
            totalE += c.E;
            totalHe += c.HE;
            totalIe += c.IE;
            totalNd += c.ND;         

            const spGaveResponses = mem.assesseeSpResponses.filter(response => response.assessorPersonId === this.studentId);

            spGaveResponses.forEach(response => {

                switch (response.mpItemResponse) {
                    case knownReponse.iea:
                        gaveCummScore += 0;
                        break;
                    case knownReponse.ieu:
                        gaveCummScore += 1;
                        break;
                    case knownReponse.nd:
                        gaveCummScore += 2;
                        break;
                    case knownReponse.eu:
                        gaveCummScore += 3;
                        break;
                    case knownReponse.ea:
                        gaveCummScore += 4;
                        break;
                    case knownReponse.heu:
                        gaveCummScore += 5;
                        break;
                    case knownReponse.hea:
                        gaveCummScore += 6;
                        break;
                    default:
                        break;
                }
            });



        });

        gaveComposite = ((gaveCummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6 * peers.length)) * 100);
        gaveComposite = Math.round(gaveComposite);
 
        gaveBo.gaveHE = Math.round((totalHe / totalMarkings * 100));
        gaveBo.gaveE = Math.round((totalE / totalMarkings * 100));
        gaveBo.gaveIE = Math.round((totalIe / totalMarkings * 100));
        gaveBo.gaveND = Math.round((totalNd / totalMarkings * 100));

        const { gaveHE, gaveE, gaveIE, gaveND } = gaveBo;

        const gaveChartData = [];

        gaveChartData.push({ name: 'Highly Effective', value: gaveHE });
        gaveChartData.push({ name: 'Effective', value: gaveE });
        gaveChartData.push({ name: 'Not Displayed', value: gaveND });
        gaveChartData.push({ name: 'Ineffective', value: gaveIE });
        // gaveChartData.push({ label: 'Highly Effective', data: gaveHE, color: '#00308F' });
        // gaveChartData.push({ label: 'Effective', data: gaveE, color: '#00AA58' });
        // gaveChartData.push({ label: 'Ineffective', data: gaveIE, color: '#AA0000' });
        // gaveChartData.push({ label: 'Not Display', data: gaveND, color: '#AAAAAA' });

        this.sos =  {
            assessComplete: missingItems.length === 0,
            stratComplete: stratComplete,
            hasComment: hasComment,
            missingAssessItems: missingItems,
            breakout: bo,
            gaveBreakOut: gaveBo,
            breakOutChartData: chartData,
            gaveBreakOutChartData: gaveChartData,
            compositeScore: composite,
            gaveCompositeScore: gaveComposite,
            stratedPosition: stratedPosition
        }

        return this.sos;
    }

    /**private updateResult(): ecat.entity.ext.IStudentDetailResult {
        const counts = {
            h: this.spResult.breakOut.highEffA + this.spResult.breakOut.highEffU,
            e: this.spResult.breakOut.effA + this.spResult.breakOut.effU,
            i: this.spResult.breakOut.ineffA + this.spResult.breakOut.ineffU,
            nd: this.spResult.breakOut.notDisplay
        }
        
        this._resultForStud.breakOutReceived = [];
        this._resultForStud.breakOutReceived.push({
            label: `Highly Effective [${counts.h}]`,
            color: '#00308F',
            data: counts.h  
        });
        this._resultForStud.breakOutReceived.push({
            label: `Effective [${counts.e}]`,
            color: '#00AA58',
            data: counts.e
        });
        this._resultForStud.breakOutReceived.push({
            label: `Ineffective [${counts.i}]`,
            color: '#AA0000',
            data: counts.i
        });
        this._resultForStud.breakOutReceived.push({
            label: `Not Displayed [${counts.nd}]`,
            color: '#AAAAAA',
            data: counts.nd
        });

        this._resultForStud.outcome = this.spResult.mpAssessResult;
        this._resultForStud.finalStrat = this.stratResult.finalStratPosition;
        this._resultForStud.compositeScore = this.spResult.compositeScore;
        return this._resultForStud;
    }
    
    get resultForStudent(): ecat.entity.ext.IStudentDetailResult {
        if (!this.spResult) return null;
        if (this._resultForStud) return this._resultForStud
        this._resultForStud = {} as any;
        return this.updateResult();
    }*/

    static initializer(entity: CrseStudentInGroup) { }
   /// </code>

}

