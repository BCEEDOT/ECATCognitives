import { Injectable } from '@angular/core';
import {
    EntityManager, NamingConvention, DataService, DataType, MetadataStore,
    EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, QueryResult
} from 'breeze-client';

import { BaseDataContext } from '../../shared/services';
import { EmProviderService } from '../../core/services/em-provider.service';
import { Course, WorkGroup, SpResult, CrseStudentInGroup, SpResponse } from '../../core/entities/student';
import { IStudentApiResources, IStudSpInventory } from "../../core/entities/client-models";
import { MpEntityType } from "../../core/common/mapStrings";
import { DataContext } from '../../app-constants';
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";

@Injectable()
export class StudentDataContext extends BaseDataContext {

    //person: IRepository<Person>;

    student: DataContext;
    isLoaded = {
        initCourses: false,
        course: {},
        crseInStudGroup: {},
        workGroup: {},
        wgResult: {},
        spInventory: {}
    }
    activeGroupId: number;
    activeCourseId: number;


    private studentApiResources: IStudentApiResources = {
        initCourses: {
            returnedEntityType: MpEntityType.course,
            resource: 'GetCourses'
        },
        course: {
            returnedEntityType: MpEntityType.course,
            resource: 'ActiveCourse'
        },
        workGroup: {
            returnedEntityType: MpEntityType.workGroup,
            resource: 'ActiveWorkGroup'
        },
        wgResult: {
            returnedEntityType: MpEntityType.spResult,
            resource: 'GetMyWgResult'
        }
    }

    constructor(emProvider: EmProviderService, private global: GlobalService) {
        super(DataContext.Student, emProvider);
    }


    initCourses(forceRefresh?: boolean): Promise<Course[]> {
        const that = this;

        let allCourses: Array<Course>;
        allCourses = this.manager.getEntities(MpEntityType.course) as Array<Course>;


        if (allCourses.length > 0) {
            console.log('Courses loaded from local cache');
            return Promise.resolve(allCourses);
        }


        let query = EntityQuery.from(this.studentApiResources.initCourses.resource);

        return <Promise<Course[]>>this.manager.executeQuery(query)
            .then(initCourseResponse)
            .catch(e => {
                console.log('Did not retrieve courses' + e);
                return Promise.reject(e);
            });

        function initCourseResponse(data: QueryResult): Array<Course> {
            const courses = data.results as Array<Course>;

            //that.isLoaded.initCourses = courses.length > 0;

            courses.forEach(course => {
                var workGroups = course.workGroups;
                if (workGroups && workGroups.length > 0) {
                    //this.isLoaded[course.id] = true;


                    workGroups.forEach(workGroup => {
                        if (workGroup.groupMembers && workGroup.groupMembers.length > 0) {
                            that.isLoaded.workGroup[workGroup.workGroupId] = true;
                        }
                    });
                }
            });
            console.log('Courses loaded from server');
            return courses;

        }
    }

    fetchActiveCourse(courseId: number, force?: boolean): Promise<Course | Promise<void>> {
        const that = this;

        // let course = this.manager.getEntityByKey(MpEntityType.workGroup, courseId) as Course;

        // if (Course && Course.length > 0) {
        //     console.log("WorkGroup loaded from local cache");
        //     return Promise.resolve(course);
        // }

        const params = { crseId: courseId }
        let query = EntityQuery.from(this.studentApiResources.course.resource).withParameters(params);

        return <Promise<Course>>this.manager.executeQuery(query)
            .then(getActiveCourseResponse)
            .catch(this.queryFailed)

        function getActiveCourseResponse(data: QueryResult) {
            let course = data.results[0] as Course

            if (!course) {
                const error = {
                    errorMessage: 'Could not find this active Course on the server'
                }

                console.log('Query succeeded, but the course did not return a result')
                return Promise.reject(() => error) as any;
            }

            return course;
        }
    }

    fetchActiveWorkGroup(workGroupId: number, forcedRefresh?: boolean): Promise<WorkGroup | Promise<void>> {

        const that = this;

        // if (!this.activeGroupId || !this.activeCourseId) {
        //     console.log('No course/workgroup selected!', null, true);
        //     return Promise.reject(() => {
        //         return 'A course/workgroup must be selected';
        //     });
        // }

        let workGroup: WorkGroup;
        //const api = this.studentApiResources;

        // if (this.isLoaded.workGroup[this.activeGroupId] && this.isLoaded.spInventory[this.activeGroupId] && !forcedRefresh) {
        //     workGroup = this.manager.getEntityByKey(MpEntityType.workGroup, this.activeGroupId) as WorkGroup;

        //     console.log('Workgroup loaded from local cache', workGroup, false);
        //     return Promise.resolve(workGroup);
        // }

        workGroup = this.manager.getEntityByKey(MpEntityType.workGroup, workGroupId) as WorkGroup;

        if (workGroup && workGroup.groupMembers.length > 0) {
            console.log("WorkGroup loaded from local cache");
            return Promise.resolve(workGroup);
        }

        const params = { wgId: workGroupId, addAssessment: false };

        // if (!this.isLoaded.spInventory[this.activeGroupId] || forcedRefresh) {
        //     params.addAssessment = true;
        // }

        // const cachedGroupMembers = this.manager.getEntities(MpEntityType.crseStudInGrp) as Array<CrseStudentInGroup>;
        // const activeGrpMems = cachedGroupMembers.filter(gm => gm.courseId === this.activeCourseId && gm.workGroupId === this.activeGroupId);
        // if (!this.isLoaded.workGroup[this.activeGroupId] && activeGrpMems.length > 0) {
        //     activeGrpMems.forEach(ent => this.manager.detachEntity(ent));
        // }

        let query = EntityQuery.from(this.studentApiResources.workGroup.resource)
            .withParameters(params);

        return <Promise<WorkGroup>>this.manager.executeQuery(query)
            .then(getActiveWorkGrpResponse)
            .catch(this.queryFailed);

        function getActiveWorkGrpResponse(data: QueryResult) {
            workGroup = data.results[0] as WorkGroup;

            if (!workGroup) {
                const error = {
                    errorMessage: 'Could not find this active workgroup on the server',
                }
                console.log('Query succeeded, but the course membership did not return a result', data, false);
                return Promise.reject(() => error) as any;
            }

            //that.isLoaded.workGroup[workGroup.workGroupId] = true;
            //that.isLoaded.spInventory[workGroup.workGroupId] = (workGroup.assignedSpInstr) ? true : false;

            console.log(workGroup);
            return workGroup;
        }
    }

    getSpInventory(courseId: number, workGroupId: number, assesseeId: number): Array<IStudSpInventory> {
        let loggedInUser: ILoggedInUser;
        loggedInUser = this.global.persona.value;
        let userId = loggedInUser.person.personId;

        let workGroup = this.manager.getEntityByKey(MpEntityType.workGroup, workGroupId) as WorkGroup;

        if (!workGroup.assignedSpInstr) {
            return null;
        }

        let inventoryList = workGroup.assignedSpInstr.inventoryCollection as Array<IStudSpInventory>;

        return inventoryList.map(inv => {
            let key = { assessorPersonId: userId, assesseePersonId: assesseeId, courseId: courseId, workGroupId: workGroupId, inventoryItemid: inv.id };

            let spResponse = this.manager.getEntityByKey(MpEntityType.spResponse, [userId, assesseeId, courseId, workGroupId, inv.id]) as SpResponse;

            if (!spResponse) {
                spResponse = this.manager.createEntity(MpEntityType.spResponse, key) as SpResponse;
            }

            inv.responseForAssessee = spResponse;
            return inv;
        });
    }



}
