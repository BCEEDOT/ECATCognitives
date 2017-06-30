import { Injectable } from '@angular/core';
import { EntityQuery, QueryResult } from 'breeze-client';

import { BaseDataContext } from "../../shared/services/base-data-context.service";
import { EmProviderService } from "../../core/services/em-provider.service";
import { GlobalService } from "../../core/services/global.service";
import { LoggerService } from "../../shared/services/logger.service";
import { DataContext } from "../../app-constants";
import { ILmsAdminApiResources } from '../../core/entities/client-models';
import { MpEntityType } from '../../core/common/mapStrings';
import { Course, WorkGroup, WorkGroupModel } from "../../core/entities/lmsadmin";

@Injectable()
export class LmsadminDataContextService extends BaseDataContext {

  private lmsAdminApiResource: ILmsAdminApiResources = {
    allCoures: {
      returnedEntityType: MpEntityType.course,
      resource: 'GetAllCourses',
    },
    allGroups: {
      returnedEntityType: MpEntityType.course,
      resource: 'GetAllGroups',
    },
    courseModels: {
      returnedEntityType: MpEntityType.unk,
      resource: 'GetCourseModels',
    },
    allCourseMembers: {
      returnedEntityType: MpEntityType.course,
      resource: 'GetAllCourseMembers',
    },
    allGroupMembers: {
      returnedEntityType: MpEntityType.workGroup,
      resource: 'GetGroupMembers',
    }
  };

  constructor(emProvider: EmProviderService, private global: GlobalService, private logger: LoggerService) { 
    super(DataContext.LmsAdmin, emProvider)
  }

  fetchAllCourses(forcedRefresh?: boolean): Promise<Array<Course>>{
    let courses: Array<Course>;

    courses = this.manager.getEntities(MpEntityType.course) as Array<Course>;

    if (courses.length > 0 && !forcedRefresh){
      console.log('Courses loaded from local cache');
      return Promise.resolve(courses);
    }

    let query: any = EntityQuery.from(this.lmsAdminApiResource.allCoures.resource);

    return <Promise<Array<Course>>>this.manager.executeQuery(query)
      .then(allCoursesResp)
      .catch((e: Event) => {
        console.log('Did not retrieve courses ' + e);
        return Promise.reject(e);
      });

    function allCoursesResp(data: QueryResult): Array<Course> {
      courses = data.results as Array<Course>;
      if (courses && courses.length > 0){
        console.log('Courses loaded from remote store', courses, false);
        return courses;
      }
    }
  }

  fetchCourseModels(courseId: number, forcedRefresh?: boolean): Promise<Array<WorkGroupModel>> {
    let models: Array<WorkGroupModel>;
    //can't be sure we have all the models unless we have gone to the server for them before
    //i think we have to go back to the serve for this every time unless we set up an "isLoaded" thing again

    const params: any = { courseId: courseId };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.courseModels.resource).withParameters(params);

    return <Promise<Array<WorkGroupModel>>>this.manager.executeQuery(query)
      .then(courseModelsResp)
      .catch((e: Event) => {
        console.log('Did not retrieve group models' + e);
        Promise.reject(e);
      })

    function courseModelsResp(data: QueryResult) {
      models = data.results as Array<WorkGroupModel>;
      if (models.length > 0) {
        console.log('Group models loaded from remote store', models, false);
        return models;
      }
    }
  }

  fetchAllGroups(courseId: number, forcedRefresh?: boolean): Promise<Array<WorkGroup>> {
    let groups: Array<WorkGroup>;

    let course = this.manager.getEntityByKey(MpEntityType.course, courseId) as Course;
    if (course && course.workGroups.length > 0 && !forcedRefresh) {
      groups = course.workGroups as Array<WorkGroup>;
      console.log('Retrieved groups from local cache', groups, false);
      return Promise.resolve(groups);
    }

    const params: any = { courseId: courseId };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.allGroups.resource).withParameters(params);

    return <Promise<Array<WorkGroup>>>this.manager.executeQuery(query)
      .then(allGroupsResp)
      .catch((e: Event) => {
        console.log('Did not retrieve groups' + e);
        return Promise.reject(e);
      });

    function allGroupsResp(data: QueryResult){
      course = data.results[0] as Course;
      groups = course.workGroups;

      if (groups && groups.length > 0){
        console.log('Groups loaded from remote store', groups, false);
        return groups;
      }
    }
  }

  fetchAllCourseMembers(courseId: number, forcedRefresh?: boolean): Promise<Course>{
    let course = this.manager.getEntityByKey(MpEntityType.course, courseId) as Course;
    if (course.students.length > 0 && course.faculty.length > 1 && !forcedRefresh){
      console.log('Retrieved course members from local cache', course, false);
      return Promise.resolve(course);
    }

    const params: any = { courseId: courseId };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.allCourseMembers.resource).withParameters(params);

    return <Promise<Course>>this.manager.executeQuery(query)
      .then(allCourseMemsResp)
      .catch((e: Event) => {
        console.log('Did not retrieve course members' + e);
        return Promise.reject(e);
      });

    function allCourseMemsResp(data: QueryResult){
      course = data.results[0] as Course;
      if (course.students.length > 0 && course.faculty.length > 1){
        console.log('Course members loaded from remote store', course, false);
      }

      console.log('No members in course');
      return course;


    }
  }

}
