import { Injectable } from '@angular/core';
import {
    EntityManager, NamingConvention, DataService, DataType, MetadataStore,
    EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, QueryResult,
} from 'breeze-client';

import { BaseDataContext } from '../../shared/services';
import { EmProviderService } from '../../core/services/em-provider.service';
import {
    Course, WorkGroup, SpResult, CrseStudentInGroup,
    SpResponse, StudSpComment, StudSpCommentFlag, StratResponse, SpInventory,
} from '../../core/entities/student';
import { IStudentApiResources, IStudSpInventory } from '../../core/entities/client-models';
import { MpEntityType, MpCommentFlag } from '../../core/common/mapStrings';
import { DataContext } from '../../app-constants';
import { GlobalService, ILoggedInUser } from '../../core/services/global.service';

@Injectable()
export class StudentDataContext extends BaseDataContext {

    student: DataContext;
    studentApiResources: IStudentApiResources = {
        initCourses: {
            returnedEntityType: MpEntityType.course,
            resource: 'GetCourses',
        },
        course: {
            returnedEntityType: MpEntityType.course,
            resource: 'ActiveCourse',
        },
        workGroup: {
            returnedEntityType: MpEntityType.workGroup,
            resource: 'ActiveWorkGroup',
        },
        wgResult: {
            returnedEntityType: MpEntityType.spResult,
            resource: 'GetMyWgResult',
        }
    }

    constructor(emProvider: EmProviderService, private global: GlobalService) {
        super(DataContext.Student, emProvider);
    }

    initCourses(forceRefresh?: boolean): Promise<Course[]> {
        const that: this = this;

        let allCourses: Course[];
        allCourses = this.manager.getEntities(MpEntityType.course) as Course[];

        if (!forceRefresh) {
            if (allCourses.length > 0) {
                return Promise.resolve(allCourses);
            }
        }

        let query: EntityQuery = EntityQuery.from(this.studentApiResources.initCourses.resource);

        return <Promise<Course[]>>this.manager.executeQuery(query)
            .then(initCourseResponse)
            .catch((e: Event) => {
                return Promise.reject(e);
            });

        function initCourseResponse(data: QueryResult): Course[] {
            const courses: Course[] = data.results as Course[];

            if (courses.length > 0) {

                courses.forEach((course: Course) => {
                    let workGroups: WorkGroup[] = course.workGroups;
                    if (workGroups && workGroups.length > 0) {

                        workGroups.forEach((workGroup: WorkGroup) => {
                            if (workGroup.groupMembers && workGroup.groupMembers.length > 0) {
                                // that.isLoaded.workGroup[workGroup.workGroupId] = true;
                            }
                        });
                    }
                });

                courses.sort((crseA: Course, crseB: Course) => {
                    if (crseA.startDate < crseB.startDate) { return 1; }
                    if (crseA.startDate > crseB.startDate) { return -1; }
                    return 0;
                });

                courses[0].workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
                    if (wgA.mpCategory < wgB.mpCategory) { return 1; }
                    if (wgA.mpCategory > wgB.mpCategory) { return -1; }
                    return 0;
                });
            }

            return courses;

        }
    }

    fetchActiveCourse(courseId: number, forcedRefresh?: boolean): Promise<Course | Promise<void>> {
        const that: this = this;

        let course: Course = this.manager.getEntityByKey(MpEntityType.workGroup, courseId) as Course;

        if (!forcedRefresh) {
            if (Course && Course.length > 0) {
                if (course.workGroups.length > 0) {

                    return Promise.resolve(course);
                }

            }
        }

        const params: any = { crseId: courseId };
        let query: EntityQuery = EntityQuery.from(this.studentApiResources.course.resource).withParameters(params);

        return <Promise<Course>>this.manager.executeQuery(query)
            .then(getActiveCourseResponse)
            .catch(this.queryFailed);

        function getActiveCourseResponse(data: QueryResult): Course  {
            let courseResults: Course = data.results[0] as Course;

            if (!courseResults) {
                const error: any = {
                    errorMessage: 'Could not find this active Course on the server',
                };

                return Promise.reject(() => error) as any;
            }

            return courseResults;
        }
    }

    getSingleStrat(studentId: number, activeGroupId: number, activeCourseId: number): StratResponse {

        const loggedUserId: number = this.global.persona.value.person.personId;

        if (!activeGroupId || !activeCourseId) {
            return undefined;
        }

        const existingStrat: StratResponse = this.manager.getEntityByKey(MpEntityType.spStrat,
                                [loggedUserId, studentId, activeCourseId, activeGroupId]) as StratResponse;

        // if (existingStrat) console.log('Strat for this individual not found', 
        // { assessor: loggedUserId, assessee: studentId, course: activeCourseId, workGroup: activeGroupId }, false);

        return (existingStrat) ? existingStrat :
            this.manager.createEntity(MpEntityType.spStrat, {
                assesseePersonId: studentId,
                assessorPersonId: loggedUserId,
                courseId: activeCourseId,
                workGroupId: activeGroupId,
            }) as StratResponse;

    }

    fetchActiveWorkGroup(workGroupId: number, forcedRefresh?: boolean): Promise<WorkGroup | Promise<void>> {

        const that: this = this;

        // if (!this.activeGroupId || !this.activeCourseId) {
        //     console.log('No course/workgroup selected!', null, true);
        //     return Promise.reject(() => {
        //         return 'A course/workgroup must be selected';
        //     });
        // }

        let workGroup: WorkGroup;
        // const api = this.studentApiResources;

        // if (this.isLoaded.workGroup[this.activeGroupId] && this.isLoaded.spInventory[this.activeGroupId] && !forcedRefresh) {
        //     workGroup = this.manager.getEntityByKey(MpEntityType.workGroup, this.activeGroupId) as WorkGroup;

        //     console.log('Workgroup loaded from local cache', workGroup, false);
        //     return Promise.resolve(workGroup);
        // }

        workGroup = this.manager.getEntityByKey(MpEntityType.workGroup, workGroupId) as WorkGroup;

        if (!forcedRefresh) {

            if (workGroup && workGroup.groupMembers.length > 0) {
                return Promise.resolve(workGroup);
            }
        }

        const params: any = { wgId: workGroupId, addAssessment: false };

        // if (!this.isLoaded.spInventory[this.activeGroupId] || forcedRefresh) {
        //     params.addAssessment = true;
        // }

        // const cachedGroupMembers = this.manager.getEntities(MpEntityType.crseStudInGrp) as Array<CrseStudentInGroup>;
        // const activeGrpMems = cachedGroupMembers.filter(gm => gm.courseId === this.activeCourseId && gm.workGroupId === this.activeGroupId);
        // if (!this.isLoaded.workGroup[this.activeGroupId] && activeGrpMems.length > 0) {
        //     activeGrpMems.forEach(ent => this.manager.detachEntity(ent));
        // }

        let query: EntityQuery = EntityQuery.from(this.studentApiResources.workGroup.resource)
            .withParameters(params);

        return <Promise<WorkGroup>>this.manager.executeQuery(query)
            .then(getActiveWorkGrpResponse)
            .catch(this.queryFailed);

        function getActiveWorkGrpResponse(data: QueryResult): WorkGroup {
            workGroup = data.results[0] as WorkGroup;

            if (!workGroup) {
                const error: any = {
                    errorMessage: 'Could not find this active workgroup on the server',
                }
                return Promise.reject(() => error) as any;
            }

            return workGroup;
        }
    }

    getSpInventory(courseId: number, workGroupId: number, assesseeId: number): IStudSpInventory[] {
        let userId: number = this.global.persona.value.person.personId;

        let workGroup: WorkGroup = this.manager.getEntityByKey(MpEntityType.workGroup, workGroupId) as WorkGroup;

        if (!workGroup.assignedSpInstr) {
            return undefined;
        }

        let inventoryList: IStudSpInventory[] = workGroup.assignedSpInstr.inventoryCollection as IStudSpInventory[];

        return inventoryList.map((inv: IStudSpInventory) => {

            let key: any = { assessorPersonId: userId, assesseePersonId: assesseeId, courseId: courseId,
                        workGroupId: workGroupId, inventoryItemId: inv.id };

            let spResponse: SpResponse = this.manager.getEntityByKey(MpEntityType.spResponse,
                                        [userId, assesseeId, courseId, workGroupId, inv.id]) as SpResponse;

            if (!spResponse) {
                spResponse = this.manager.createEntity(MpEntityType.spResponse, key) as SpResponse;
            }

            inv.resetAssess();
            inv.responseForAssessee = spResponse;
            return inv;
        });
    }

    getComment(courseId: number, workGroupId: number, recipientId: number): StudSpComment {
        let userId: number = this.global.persona.value.person.personId;

        if (!courseId || !workGroupId || !recipientId) {
            return undefined;
        }

        let spComments: StudSpComment[] = this.manager.getEntities(MpEntityType.spComment) as StudSpComment[];

        let comment: StudSpComment = spComments.filter((c: StudSpComment) => c.authorPersonId === userId
            && c.recipientPersonId === recipientId && c.courseId === courseId && c.workGroupId === workGroupId)[0];

        if (comment) {
            return comment;
        }

        let newComment: any = {
            authorPersonId: userId,
            recipientPersonId: recipientId,
            courseId: courseId,
            workGroupId: workGroupId,
            commentVersion: 0,
            requestAnonymity: false,
        };

        let newFlag: any = {
            authorPersonId: userId,
            recipientPersonId: recipientId,
            courseId: courseId,
            mpAuthor: MpCommentFlag.neut,
        }

        let returnedComment: StudSpComment = this.manager.createEntity(MpEntityType.spComment, newComment) as StudSpComment;
        let flag: StudSpCommentFlag = this.manager.createEntity(MpEntityType.spCommentFlag, newFlag) as StudSpCommentFlag;
        returnedComment.flag = flag;
        return returnedComment;
    }

    fetchWgResult(workGroupId: number): Promise<SpResult | Promise<void>> {
        const that: this = this;
        let workGroup: WorkGroup;
        let inventory: SpInventory[];


        const cachedResult: SpResult[] = this.manager.getEntities(MpEntityType.spResult) as SpResult[];


        workGroup = that.manager.getEntityByKey(MpEntityType.workGroup, workGroupId) as WorkGroup;
        inventory = workGroup.assignedSpInstr.inventoryCollection;
        const result: SpResult = cachedResult.filter((cr: SpResult) => cr.workGroupId === workGroupId)[0];
        if (result) {
            inventory.forEach((item: SpInventory) => {
                item.resetResult();
                item.spResult = result;
                return item;
            });
            return Promise.resolve(result);
        }


        const params: any = { wgId: workGroupId, addInstrument: false };

        let query: EntityQuery = EntityQuery.from(this.studentApiResources.wgResult.resource)
            .withParameters(params);

        return <Promise<SpResult>>this.manager.executeQuery(query)
            .then(getWgSpResultResponse)
            .catch(this.queryFailed);

        function getWgSpResultResponse(data: QueryResult): SpResult {
            const result: SpResult = data.results[0] as SpResult;
            if (!result) {
                const queryError: any = {
                    errorMessage: 'No sp result was returned from the server',
                }
                return Promise.reject(queryError) as any;
            }
            workGroup = that.manager.getEntityByKey(MpEntityType.workGroup, workGroupId) as WorkGroup;

            inventory = workGroup.assignedSpInstr.inventoryCollection;
            if (!inventory) {
                return Promise.reject('Then required inventory for this result was not in the returned set;') as any;
            }
            inventory.forEach((item: SpInventory) => {
                item.resetResult();
                item.spResult = result;
                return item;
            });
            return result;
        }
    }

}
