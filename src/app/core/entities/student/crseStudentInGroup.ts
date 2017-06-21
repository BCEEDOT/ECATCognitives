import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { SpResponse } from './SpResponse';
import { StratResponse } from './StratResponse';
import { StudSpComment } from './StudSpComment';
import { WorkGroup } from './WorkGroup';
import { SpResult } from './SpResult';
import { StratResult } from './StratResult';
import { StudentInCourse } from './StudentInCourse';
import { ProfileStudent } from './ProfileStudent';

/// <code-import> Place custom imports between <code-import> tags
import { EcLocalDataService } from "../../common/static"
import * as mp from "../../common/mapStrings"

interface ICrseStudInGrpStatus {
    assessComplete: boolean;
    isPeerAllComplete: boolean;
    stratComplete: boolean;
    stratedPosition: number;
    missingAssessItems: Array<number>;
    hasComment: boolean;
}
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
    assesseeSpResponses: SpResponse[];
    assesseeStratResponse: StratResponse[];
    assessorSpResponses: SpResponse[];
    assessorStratResponse: StratResponse[];
    authorOfComments: StudSpComment[];
    course: Course;
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

    constructor() {
        super();
    }

    protected sop: any;

    

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

    updateStatusOfPeer(): any {
        if (!this.sop) this.sop = {};
        const groupMembers = this.workGroup.groupMembers.filter(gm => !gm.entityAspect.entityState.isDetached());

        groupMembers.forEach((gm) => {

            const sigStatus: ICrseStudInGrpStatus = {
                assessComplete: false,
                stratComplete: false,
                isPeerAllComplete: false,
                missingAssessItems: [],
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

            }

            

            sigStatus.assessComplete = sigStatus.missingAssessItems.length === 0;
            sigStatus.isPeerAllComplete = sigStatus.assessComplete && sigStatus.stratComplete;
            this.sop[gm.studentId.toString()] = sigStatus;
        });
        return this.sop;
    }

    static initializer(entity: CrseStudentInGroup) { }
    /// </code>

}

