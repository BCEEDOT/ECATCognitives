import { Injectable } from '@angular/core';
import { EntityQuery, QueryResult } from 'breeze-client';

import { BaseDataContext } from "../../shared/services/base-data-context.service";
import { EmProviderService } from "../../core/services/em-provider.service";
import { GlobalService } from "../../core/services/global.service";
import { LoggerService } from "../../shared/services/logger.service";
import { DataContext } from "../../app-constants";
import { ILmsAdminApiResources, ISaveGradesResult } from '../../core/entities/client-models';
import { MpEntityType } from '../../core/common/mapStrings';
import { Course, WorkGroup, WorkGroupModel, CourseReconResult, MemReconResult, GroupReconResult, GroupMemReconResult } from "../../core/entities/lmsadmin";

@Injectable()
export class LmsadminDataContextService extends BaseDataContext {

  private lmsAdminApiResource: ILmsAdminApiResources = {
    allCourses: {
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
    },
    allGroupSetMembers: {
      returnedEntityType: MpEntityType.workGroup,
      resource: 'GetAllGroupSetMembers',
    },
    pollCourses: {
      returnedEntityType: MpEntityType.courseRecon,
      resource: 'PollCourses',
    },
    pollCourseMembers: {
      returnedEntityType: MpEntityType.memRecon,
      resource: 'PollCourseMembers',
    },
    pollGroups: {
      returnedEntityType: MpEntityType.groupRecon,
      resource: 'PollGroups',
    },
    pollAllGroupMembers: {
      returnedEntityType: MpEntityType.grpMemRecon,
      resource: 'PollGroupCategory',
    },
    syncBbGrades: {
      returnedEntityType: MpEntityType.unk,
      resource: 'SyncBbGrades',
    }
  };

  constructor(emProvider: EmProviderService, private global: GlobalService, private logger: LoggerService) {
    super(DataContext.LmsAdmin, emProvider)
  }

  fetchAllCourses(forcedRefresh?: boolean): Promise<Array<Course>> {
    let courses: Array<Course>;

    courses = this.manager.getEntities(MpEntityType.course) as Array<Course>;

    if (courses.length > 0 && !forcedRefresh) {
      console.log('Courses loaded from local cache');
      return Promise.resolve(courses);
    }

    let query: any = EntityQuery.from(this.lmsAdminApiResource.allCourses.resource);

    return <Promise<Array<Course>>>this.manager.executeQuery(query)
      .then(allCoursesResp)
      .catch((e: Event) => {
        console.log('Did not retrieve courses ' + e);
        return Promise.reject(e);
      });

    function allCoursesResp(data: QueryResult): Array<Course> {
      courses = data.results as Array<Course>;
      if (courses && courses.length > 0) {
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

    //drop all the groups so that we aren't messing with another course's groups on the group set screen
    //if you browse the sets for multiple courses of the same type, they are all using the same models so the groups from each are attached
    let groups = this.manager.getEntities(MpEntityType.workGroup) as Array<WorkGroup>;
    groups.forEach(grp => {
      grp.entityAspect.setDetached();
    });
    
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

    function allGroupsResp(data: QueryResult) {
      course = data.results[0] as Course;
      groups = course.workGroups;

      if (groups && groups.length > 0) {
        console.log('Groups loaded from remote store', groups, false);
        return groups;
      }
    }
  }

  fetchAllCourseMembers(courseId: number, forcedRefresh?: boolean): Promise<Course> {
    let course = this.manager.getEntityByKey(MpEntityType.course, courseId) as Course;
    if (course.students.length > 0 && course.faculty.length > 1 && !forcedRefresh) {
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

    function allCourseMemsResp(data: QueryResult) {
      course = data.results[0] as Course;
      if (course.students.length > 0 && course.faculty.length > 1) {
        console.log('Course members loaded from remote store', course, false);
      }

      console.log('No members in course');
      return course;


    }
  }

  fetchAllGroupSetMembers(courseId, categoryId, forceRefresh?: boolean): Promise<Array<WorkGroup> | Promise<void>> {
    const self = this;

    let groups = this.manager.getEntities(MpEntityType.workGroup) as Array<WorkGroup>;

    //TODO: Add check if GroupSetMembers has already been retrieved from the server. 

    // if (groups) {

    //   groups.forEach(group => {
        
    //   })

    //   console.log('GroupSet memberships loaded from local cache', false);
    //   return Promise.resolve(groups);
    // }

    const params: any = { courseId: courseId, categoryId: categoryId };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.allGroupSetMembers.resource).withParameters(params);


    return <Promise<Array<WorkGroup>>>this.manager.executeQuery(query)
      .then(getAllGroupSetMembers)
      .catch((e: Event) => {
        console.log('Did not retrieve groupset members' + e);
        return Promise.reject(e);
      });

    function getAllGroupSetMembers(groupSetMembersResult: QueryResult) {

      groups = groupSetMembersResult.results as WorkGroup[];

      groups.forEach(group => {
        if (group.groupMembers.length < 1) {
          console.log('group has no members - ' + group.defaultName);
        }
      })

      return groups;

    }
  }

  pollCourses(): Promise<CourseReconResult> {
    let query: any = EntityQuery.from(this.lmsAdminApiResource.pollCourses.resource);

    return <Promise<CourseReconResult>>this.manager.executeQuery(query)
      .then(allCoursesResp)
      .catch((e: Event) => {
        console.log('Did not retrieve courses ' + e);
        return Promise.reject(e);
      });

    function allCoursesResp(data: QueryResult): CourseReconResult {
      let courseRecon = data.results[0] as CourseReconResult;
      if (courseRecon) {
        console.log('Courses loaded from remote store', courseRecon, false);
        return courseRecon;
      }
    }
  }

  cachedCourses(): Array<Course>{
    return this.manager.getEntities(MpEntityType.course) as Array<Course>;
  }

  pollCourseMembers(courseId: number): Promise<MemReconResult> {
    const params: any = { courseId: courseId };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.pollCourseMembers.resource).withParameters(params);


    return <Promise<MemReconResult>>this.manager.executeQuery(query)
      .then(allCoursesResp)
      .catch((e: Event) => {
        console.log('Did not retrieve course members ' + e);
        return Promise.reject(e);
      });

    function allCoursesResp(data: QueryResult): MemReconResult {
      let memRecon = data.results[0] as MemReconResult;
      if (memRecon) {
        console.log('Course members loaded from remote store', memRecon, false);
        return memRecon;
      }
    }
  }

  pollGroups(courseId: number): Promise<GroupReconResult> {
    const params: any = { courseId: courseId };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.pollGroups.resource).withParameters(params);


    return <Promise<GroupReconResult>>this.manager.executeQuery(query)
      .then(groupsResp)
      .catch((e: Event) => {
        console.log('Did not retrieve groups ' + e);
        return Promise.reject(e);
      });

    function groupsResp(data: QueryResult): GroupReconResult {
      let grpRecon = data.results[0] as GroupReconResult;
      if (grpRecon) {
        console.log('Groups loaded from remote store', grpRecon, false);
        return grpRecon;
      }
    }
  }

  pollAllGroupMembers(courseId: number): Promise<Array<GroupMemReconResult>> {
    const params: any = { courseId: courseId };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.pollAllGroupMembers.resource).withParameters(params);


    return <Promise<Array<GroupMemReconResult>>>this.manager.executeQuery(query)
      .then(grpMemResp)
      .catch((e: Event) => {
        console.log('Did not retrieve group members ' + e);
        return Promise.reject(e);
      });

    function grpMemResp(data: QueryResult): Array<GroupMemReconResult> {
      let grpMemRecon = data.results as Array<GroupMemReconResult>;
      if (grpMemRecon) {
        console.log('Group members loaded from remote store', grpMemRecon, false);
        return grpMemRecon;
      }
    }
  }

  syncBbGrades(courseId: number, category: string): Promise<ISaveGradesResult> {
    const params: any = { crseId: courseId, wgCategory: category };
    let query: any = EntityQuery.from(this.lmsAdminApiResource.syncBbGrades.resource).withParameters(params);


    return <Promise<ISaveGradesResult>>this.manager.executeQuery(query)
      .then(syncGradesResp)
      .catch((e: Event) => {
        console.log('Bb Gradebook Sync error ' + e);
        return Promise.reject(e);
      });

    function syncGradesResp(data: QueryResult): ISaveGradesResult {
      let syncResult = data.results[0] as ISaveGradesResult;
      if (syncResult) {
        console.log('Bb Gradebook Sync ' + syncResult.message, syncResult, false);
        return syncResult;
      }
    }
  }
}
