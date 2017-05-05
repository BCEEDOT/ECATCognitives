import { Injectable } from '@angular/core';
import {
    EntityManager, NamingConvention, DataService, DataType, MetadataStore,
    EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, QueryResult
} from 'breeze-client';

import { BaseDataContext } from '../../shared/services';
import { EmProviderService } from '../../core/services/em-provider.service';
import { Course, WorkGroup, SpResult } from '../../core/entities/student';
import { IStudentApiResources } from "../../core/entities/client-models";
import { MpEntityType } from "../../core/common/mapStrings";
import { DataContext } from '../../app-constants';

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

    constructor(emProvider: EmProviderService) {
        super(DataContext.Student, emProvider);
    }


    initCourses(forceRefresh?: boolean): Promise<Course[]> {
        const that = this;

        if (this.isLoaded.initCourses && !forceRefresh) {
            const allCourses = this.manager.getEntities(MpEntityType.course) as Array<Course>;
            console.log('Courses loaded from local cache'), allCourses, false;
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
                            //that.isLoaded.workGroup[workGroup.workGroupId] = true;
                        }
                    });
                }
            });
            console.log('Courses loaded from server');
            return courses;

        }
    }



}
