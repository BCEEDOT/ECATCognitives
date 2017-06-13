import { Injectable } from '@angular/core';
import {
  EntityManager, NamingConvention, DataService, DataType, MetadataStore,
  EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, QueryResult,
} from 'breeze-client';

import { BaseDataContext } from '../../shared/services';
import { Course, WorkGroup } from "../../core/entities/faculty";
import { EmProviderService } from '../../core/services/em-provider.service';
import { IFacultyApiResources } from '../../core/entities/client-models';
import { MpEntityType, MpCommentFlag } from '../../core/common/mapStrings';
import { DataContext } from '../../app-constants';
import { GlobalService, ILoggedInUser } from '../../core/services/global.service';

@Injectable()
export class FacultyDataContextService extends BaseDataContext {

  private facultyApiResource: IFacultyApiResources = {
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
    instrument: {
      returnedEntityType: MpEntityType.spInstr,
      resource: 'SpInstrument',
    },
    wgComment: {
      returnedEntityType: MpEntityType.spComment,
      resource: 'ActiveWgSpComment',
    },
    wgFacComment: {
      returnedEntityType: MpEntityType.facSpComment,
      resource: 'ActiveWgFacComment',
    },
    wgResult: {
      returnedEntityType: MpEntityType.workGroup,
      resource: 'ActiveWgSpResult',
    },
    currentWorkGroup: {
      returnedEntityType: MpEntityType.workGroup,
      resource: 'GetRoadRunnerWorkGroups',
    },
  };

  constructor(emProvider: EmProviderService, private global: GlobalService) {
    super(DataContext.Faculty, emProvider);
  }

  getActiveCourse(courseId: number, forceRefresh?: boolean): Promise<Course | Promise<void>> {
    const that: any = this;
    let course: Course;


    course = this.manager.getEntityByKey(MpEntityType.course, courseId) as Course;

    const params: any = { courseId: courseId };

    let query: any = EntityQuery.from(this.facultyApiResource.course.resource).withParameters(params);

    const resource: any = this.facultyApiResource.course.resource;

    return <Promise<Course>>this.manager.executeQuery(query)
      .then(fetchActiveCourseResponse)
      .catch(this.queryFailed);

    function fetchActiveCourseResponse(data: QueryResult): Course {
      course = data.results[0] as Course;

      if (!course) {
        const error: any = {
          errorMessage: 'Could not find this active Course on the server',
        };

        console.log('Query succeeded, but the course did not return a result');
        return Promise.reject(() => error) as any;
      }

      const workGroups: WorkGroup[] = course.workGroups;

      if (workGroups && workGroups.length > 0) {
        // that.isLoaded.course[course.id] = true;
      }

      console.log('Course loaded from remote store', course, false);

      return course;
    }
  }

  initCourses(forceRefresh?: boolean): Promise<Course[]> {
    const that: any = this;
    let courses: Course[];

    courses = this.manager.getEntities(MpEntityType.course) as Course[];

    if (courses.length > 0) {
      console.log('Courses loaded from local cache');
      return Promise.resolve(courses);
    }

    const api: any = this.facultyApiResource;

    let query: any = EntityQuery.from(this.facultyApiResource.initCourses.resource);


    return <Promise<Course[]>>this.manager.executeQuery(query)
      .then(initCoursesReponse)
      .catch((e: Event) => {
        console.log('Did not retrieve courses' + e);
        return Promise.reject(e);
      });


    function initCoursesReponse(data: QueryResult): Course[] {
      courses = data.results as Course[]

      courses.forEach((course: Course) => {
        const workGroups: WorkGroup[] = course.workGroups;
        if (workGroups && workGroups.length > 0) {
          // that.isLoaded.course[course.id] = true;
        }
      });
      console.log('Courses loaded from remote store', courses, false);
      return courses;
    }
  }

  fetchActiveWorkGroup(crsId: number, grpId: number, forceRefresh?: boolean): Promise<WorkGroup> {
    const that = this;
    let workgroup = this.manager.getEntityByKey(MpEntityType.workGroup, grpId) as WorkGroup;

    if (workgroup && workgroup.groupMembers.length > 0) {
      console.log('WorkGroup loaded from local cache');
      return Promise.resolve(workgroup);
    }

    const params = { courseId: crsId, workGroupId: grpId };

    let query = EntityQuery.from(this.facultyApiResource.workGroup.resource).withParameters(params);

    return <Promise<WorkGroup>>this.manager.executeQuery(query)
      .then(fetchActiveWorkGroupResponse)
      .catch(this.queryFailed);

    function fetchActiveWorkGroupResponse(data: QueryResult){
      let retGroup = data.results[0] as WorkGroup;

      if (!retGroup){
        const error = {
          errorMessage: 'Could not find this active workgroup on the server'
        }
        console.log('Query succeeded, but no workgroup data was returned', data, false);
        return Promise.reject(() => error) as any;
      }

      console.log(retGroup);
      return retGroup
    }

  }

}
