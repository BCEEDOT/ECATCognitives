import { Injectable } from '@angular/core';

import { BaseDataContext, IRepository } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import { Person } from '../../entities/user';
import { DataContext, UserResources } from '../../../app-constants';

@Injectable()
export class UserDataContext extends BaseDataContext {

    //person: IRepository<Person>;

    user: IDataContext;

    private studentApiResources: IStudentApiResources = {
        initCourses: {
            returnedEntityType: _mp.MpEntityType.course,
            resource: 'GetCourses'
        },
        course: {
            returnedEntityType: _mp.MpEntityType.course,
            resource: 'ActiveCourse'
        },
        workGroup: {
            returnedEntityType: _mp.MpEntityType.workGroup,
            resource: 'ActiveWorkGroup'
        },
        wgResult: {
            returnedEntityType: _mp.MpEntityType.spResult,
            resource: 'GetMyWgResult'
        }
    } 


    /**
     *
     */
    constructor(emProvider: EmProviderService) {
        super(DataContext.User); //This sets the current entitymanager to user
        //this.user = this.createRepository('user', userClientExtensions); //this returns the correct entityManager
        console.log(this.user);
        this.manager = emProviderSerive.getManager[user];
    }

    activate() {};

    fetchActiveCourse(){
        let query = EntityQuery.from(studentApiResources.course.resource);

        return <Promise<Course>>this.em.executeQuery(query)
        .then(res => {
            return res.results[0] as course
        })
        .catch(e => {
            console.log('Did not retrieve profile' + e);
            return Promise.reject(e);
        });

    }

    fetchActiveWorkGroup(){};

}
