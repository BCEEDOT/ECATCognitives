import { Injectable } from '@angular/core';
import {
  EntityManager, NamingConvention, DataService, DataType, MetadataStore,
  EntityType, NavigationProperty, DataProperty, EntityQuery, DataServiceOptions, config, promises, QueryResult
} from 'breeze-client';

import { BaseDataContext } from '../../shared/services';
import { Course, WorkGroup } from "../../core/entities/faculty";
import { EmProviderService } from '../../core/services/em-provider.service';
import { IFacultyApiResources } from "../../core/entities/client-models";
import { MpEntityType, MpCommentFlag } from "../../core/common/mapStrings";
import { DataContext } from '../../app-constants';
import { GlobalService, ILoggedInUser } from "../../core/services/global.service";


@Injectable()
export class FacultyDataContextService extends BaseDataContext {

  activeCourseId: number;

  private facultyApiResource: IFacultyApiResources = {
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
    instrument: {
      returnedEntityType: MpEntityType.spInstr,
      resource: 'SpInstrument'
    },
    wgComment: {
      returnedEntityType: MpEntityType.spComment,
      resource: 'ActiveWgSpComment'
    },
    wgFacComment: {
      returnedEntityType: MpEntityType.facSpComment,
      resource: 'ActiveWgFacComment'
    },
    wgResult: {
      returnedEntityType: MpEntityType.workGroup,
      resource: 'ActiveWgSpResult'
    },
    currentWorkGroup: {
      returnedEntityType: MpEntityType.workGroup,
      resource: 'GetRoadRunnerWorkGroups'
    }
  }

  constructor(emProvider: EmProviderService, private global: GlobalService) {
    super(DataContext.Faculty, emProvider);
  }

  getActiveCourse(courseId: number, forceRefresh?: boolean): Promise<Course | Promise<void>> {
    const that = this;
    let course: Course;


    course = this.manager.getEntityByKey(MpEntityType.course, courseId) as Course;

    const params = { courseId: courseId }

    let query = EntityQuery.from(this.facultyApiResource.course.resource).withParameters(params);

    const resource = this.facultyApiResource.course.resource;

    return <Promise<Course>>this.manager.executeQuery(query)
      .then(fetchActiveCourseResponse)
      .catch(this.queryFailed)

    function fetchActiveCourseResponse(data: QueryResult): Course {
      course = data.results[0] as Course;

      if (!course) {
        const error = {
          errorMessage: 'Could not find this active Course on the server'
        }

        console.log('Query succeeded, but the course did not return a result')
        return Promise.reject(() => error) as any;
      }


      const workGroups = course.workGroups;

      if (workGroups && workGroups.length > 0) {
        //that.isLoaded.course[course.id] = true;
      }

      console.log('Course loaded from remote store', course, false);

      return course;
    }
  }

  initCourses(forceRefresh?: boolean): Promise<Course[]> {
    const that = this;
    let courses: Array<Course>;

    courses = this.manager.getEntities(MpEntityType.course) as Array<Course>;

    if (courses.length > 0) {
      console.log('Courses loaded from local cache');
      return Promise.resolve(courses);
    }

    const api = this.facultyApiResource;

    let query = EntityQuery.from(this.facultyApiResource.initCourses.resource);


    return <Promise<Course[]>>this.manager.executeQuery(query)
      .then(initCoursesReponse)
      .catch(e => {
        console.log('Did not retrieve courses' + e);
        return Promise.reject(e);
      });


    function initCoursesReponse(data: QueryResult): Array<Course> {
      courses = data.results as Array<Course>;

      courses.forEach(course => {
        const workGroups = course.workGroups;
        if (workGroups && workGroups.length > 0) {
          //that.isLoaded.course[course.id] = true;
        }
      });
      console.log('Courses loaded from remote store', courses, false);
      return courses;
    }
  }

   fetchRoadRunnerWorkGroups(courseId: number, forceRefresh?: boolean): Promise<WorkGroup[] | Promise<void>> {
         const self = this;

         let flights = this.manager.getEntities(MpEntityType.workGroup) as WorkGroup[];

    //     if (this.isLoaded.roadRunner[this.activeCourseId] && !forceRefresh) {
    //         if (flights) {
    //             let rrFlights = flights.filter(wg => {
    //                 return (wg.courseId === this.activeCourseId && wg.mpCategory === _mp.MpGroupCategory.bc1);
    //             });
    //             this.log.success('Roadrunner info loaded from local cache', rrFlights, false);
    //             return this.c.$q.when(rrFlights);
    //         }
    //     }

        let query = EntityQuery.from(this.facultyApiResource.currentWorkGroup.resource).withParameters({courseId: courseId});

        return <Promise<WorkGroup[]>>this.manager.executeQuery(query)
            //.using(this.manager)
            //.withParameters({ courseId: courseId })
            //.execute()
            .then(getCurrentWorkGroup)
            .catch(this.queryFailed);

        function getCurrentWorkGroup(workGroupResult: QueryResult) {
            if (workGroupResult.results.length === 0) {
                console.log('Roadrunner query did not return any results', workGroupResult.results, false);
            } else {
               // self.isLoaded.roadRunner[self.activeCourseId] = true;
                console.log('Roadrunner info loaded from remote store', workGroupResult.results, false);
            }
            return workGroupResult.results;
        }
    }

}
