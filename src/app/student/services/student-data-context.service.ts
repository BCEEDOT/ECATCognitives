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
        course: {}
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
            .then(res => {
                console.log(res.results);
                var store = this.manager.metadataStore;
                var courseType = store.getEntityType('Course');
                courseType.dataProperties.forEach((dp) => {
                    console.log(dp.name);
                });

                console.log(store);
                console.log(courseType);
                var course = res.results[0];
                course.entityAspect;
                course.entityType;
                return res.results as Array<Course>;
                
                
            })
            .catch(e => {
                console.log('Did not retrieve users' + e);
                return Promise.reject(e);
            });
    }

}
