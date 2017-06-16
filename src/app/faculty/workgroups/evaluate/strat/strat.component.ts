import { Component, OnInit, Input } from '@angular/core';
import { TdDialogService } from "@covalent/core";
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { WorkGroup, CrseStudentInGroup } from "../../../../core/entities/faculty";
import { SpProviderService } from "../../../../provider/sp-provider/sp-provider.service";
import { FacultyDataContextService } from "../../../services/faculty-data-context.service";
import { FacWorkgroupService } from "../../../services/facworkgroup.service";


@Component({
    selector: 'strat',
    templateUrl: './strat.component.html',
    styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit {

    groupMembers: CrseStudentInGroup[];
    groupCount: number;
    workGroupId: number;
    courseId: number;

    constructor(private spProvider: SpProviderService, private facultyDataContext: FacultyDataContextService,
        private dialogService: TdDialogService, private snackBarService: MdSnackBar, private route: ActivatedRoute, private facWorkGroupService: FacWorkgroupService) {

        this.route.params.subscribe(params => {
            this.workGroupId = +params['wrkGrpId'];
            this.courseId = +params['crsId'];

        });
    }

    @Input() members: CrseStudentInGroup[];

    ngOnInit() {
        this.activate();
    }

    activate() {
        this.groupMembers = this.members;
        this.groupCount = this.groupMembers.length;
        this.evaluateStrat(true);
    }

    cancel() {
        if (this.groupMembers.some(gm => gm.proposedStratPosition !== null)) {
            this.dialogService.openConfirm({
                message: 'Are you sure you want to cancel and discard your changes?',
                title: 'Unsaved Changed',
                acceptButton: 'Yes',
                cancelButton: 'No'
            }).afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.groupMembers.forEach(gm => {
                        gm.stratValidationErrors = [];
                        gm.stratIsValid = true;
                        gm.proposedStratPosition = undefined;
                    });
                    this.snackBarService.open('Changes Discarded', 'Dismiss', { duration: 2000 })
                    //this.location.back();
                }
            });
        } else {
            //this.location.back();
        }
    }

    isValid(): boolean {
        let invalidStrats = this.groupMembers.some(gm => !gm.stratIsValid);
        let isDirty = this.groupMembers.some(gm => gm.proposedStratPosition !== null);

        if (!isDirty) {
            return true;
        }

        if (invalidStrats) {
            return true;
        }

        return false;

    }

    isPristine(): boolean {
        return this.groupMembers.some(gm => gm.proposedStratPosition !== null);
    }

    evaluateStrat(force?: boolean): void {
        this.spProvider.evaluateStratification(true, force);
    }

    saveChanges(): void {
        const that = this;
        this.evaluateStrat(true);

        const hasErrors = this.groupMembers
            .some(gm => !gm.stratIsValid);

        if (hasErrors) {
            this.dialogService.openAlert({
                message: 'Your proposed changes contain errors, please ensure all proposed changes are valid before saving'
            })
        }

        const gmWithChanges = this.groupMembers
            .filter(gm => gm.proposedStratPosition !== null);

        const changeSet = [] as Array<number>;

        gmWithChanges.forEach(gm => {
            const stratResponse = this.facultyDataContext.getSingleStrat(this.courseId, this.workGroupId, gm.studentId);
            stratResponse.stratPosition = gm.proposedStratPosition;
            changeSet.push(gm.studentId);
        });

        this.spProvider.save().then(() => {

            this.groupMembers
                .filter(gm => changeSet.some(cs => cs === gm.studentId))
                .forEach(gm => {
                    gm.updateStatusOfStudent();
                    gm.stratValidationErrors = [];
                    gm.stratIsValid = true;
                    gm.proposedStratPosition = null;
                });
            this.facWorkGroupService.stratComplete(true);
            this.snackBarService.open("Success, Strats Updated!", 'Dismiss')
        }).catch((error) => {
            this.dialogService.openAlert({
                message: 'There was an error saving your changes, please try again.'
            })
        })

    }

}
