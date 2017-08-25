import { Injectable } from '@angular/core';
import {
  config,
  DataProperty,
  DataService,
  DataServiceOptions,
  DataType,
  EntityManager,
  EntityQuery,
  EntityType,
  MetadataStore,
  NamingConvention,
  NavigationProperty,
  promises,
  QueryResult,
} from 'breeze-client';
import { any } from 'codelyzer/util/function';

import { BaseDataContext } from '../../shared/services';

import {
  Course, WorkGroup, FacSpResponse, FacSpComment, FacSpCommentFlag,
  FacStratResponse, StudSpComment, CrseStudentInGroup, SpInstrument, SpInventory
} from "../../core/entities/faculty";

import { EmProviderService } from '../../core/services/em-provider.service';
import { IFacultyApiResources } from '../../core/entities/client-models';
import { IStudSpInventory, IFacSpInventory } from "../../core/entities/client-models";
import { MpEntityType, MpCommentFlag } from '../../core/common/mapStrings';
import { DataContext } from '../../app-constants';
import { GlobalService, ILoggedInUser } from '../../core/services/global.service';
import { LoggerService } from "../../shared/services/logger.service";


@Injectable()
export class FacultyDataContextService extends BaseDataContext {


  activeCourseId: number;


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
    allCourseMembers: {
      returnedEntityType: MpEntityType.course,
      resource: 'GetAllCourseMembers',
    },
  };

  constructor(emProvider: EmProviderService, private global: GlobalService, private logger: LoggerService) {
    super(DataContext.Faculty, emProvider);
  }

  fetchAllCourseMembers(courseId: number, forcedRefresh?: boolean): Promise<Course> {
    let course = this.manager.getEntityByKey(MpEntityType.course, courseId) as Course;
    if (course.students.length > 0 && course.faculty.length > 1 && !forcedRefresh) {
      console.log('Retrieved course members from local cache', course, false);
      return Promise.resolve(course);
    }

    const params: any = { courseId: courseId };
    let query: any = EntityQuery.from(this.facultyApiResource.allCourseMembers.resource).withParameters(params);

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

      //console.log('No members in course');
      return course;


    }
  }

  getActiveCourse(courseId: number, forceRefresh?: boolean): Promise<Course | Promise<void>> {
    const that: any = this;
    let course: Course;


    course = this.manager.getEntityByKey(MpEntityType.course, courseId) as Course;

    if (!forceRefresh && course) {
      if (course.workGroups.length > 0) {
        return Promise.resolve(course);
      }
    }

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

    if (courses.length > 0 && !forceRefresh) {
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


  fetchRoadRunnerWorkGroups(courseId: number, forceRefresh?: boolean): Promise<WorkGroup[] | Promise<void>> {
    const self = this;

    let flights = this.manager.getEntities(MpEntityType.workGroup) as WorkGroup[];

    let query = EntityQuery.from(this.facultyApiResource.currentWorkGroup.resource).withParameters({ courseId: courseId });

    return <Promise<WorkGroup[]>>this.manager.executeQuery(query)

      .then(getCurrentWorkGroup)
      .catch(this.queryFailed);

    function getCurrentWorkGroup(workGroupResult: QueryResult) {
      if (workGroupResult.results.length === 0) {
        console.log('Roadrunner query did not return any results', workGroupResult.results, false);
      } else {
        console.log('Roadrunner info loaded from remote store', workGroupResult.results, false);
      }
      return workGroupResult.results;
    }
  }

  fetchActiveWorkGroup(crsId: number, grpId: number, forceRefresh?: boolean): Promise<WorkGroup> {
    const that = this;
    let workgroup = this.manager.getEntityByKey(MpEntityType.workGroup, grpId) as WorkGroup;

    if (workgroup && workgroup.groupMembers.length > 0 && !forceRefresh && workgroup.assignedSpInstr !== null) {
      console.log('WorkGroup loaded from local cache');
      return Promise.resolve(workgroup);
    }

    const params = { courseId: crsId, workGroupId: grpId };

    let query = EntityQuery.from(this.facultyApiResource.workGroup.resource).withParameters(params);

    return <Promise<WorkGroup>>this.manager.executeQuery(query)
      .then(fetchActiveWorkGroupResponse)
      .catch(this.queryFailed);

    function fetchActiveWorkGroupResponse(data: QueryResult) {
      let retGroup = data.results[0] as WorkGroup;

      if (!retGroup) {
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

  getFacSpInventory(courseId: number, workGroupId: number, assesseeId: number): IFacSpInventory[] {

    const workGroup = this.manager.getEntityByKey(MpEntityType.workGroup, workGroupId) as WorkGroup;
    let userId = this.global.persona.value.person.personId;

    if (!workGroup.assignedSpInstr) {
      console.log('Missing an assigned instrument for this workgroup', workGroup, false);
      return null;
    }

    //const inventoryList = workGroup.assignedSpInstr.inventoryCollection as Array<ecat.entity.IStudSpInventory>;
    let inventoryList = workGroup.assignedSpInstr.inventoryCollection as IFacSpInventory[];

    return inventoryList.map((invItem: IFacSpInventory) => {
      const key = { assesseePersonId: assesseeId, courseId: courseId, workGroupId: workGroupId, inventoryItemId: invItem.id };

      let facSpReponse = this.manager.getEntityByKey(MpEntityType.facSpResponse, [assesseeId, courseId, workGroupId, invItem.id]) as FacSpResponse;

      if (!facSpReponse) {
        facSpReponse = this.manager.createEntity(MpEntityType.facSpResponse, key) as FacSpResponse;
        facSpReponse.facultyPersonId = userId
      }
      //Since we are reusing the inventory item breeze will auto try the backing fields...need to reset them to ensure there is no carryover between assessments;
      invItem.resetAssess();
      invItem.responseForAssessee = facSpReponse;

      return invItem;
    }) as IFacSpInventory[];

  }

  getFacComment(courseId: number, groupId: number, assesseeId: number): FacSpComment {
    let userId = this.global.persona.value.person.personId;

    const facComments = this.manager.getEntities(MpEntityType.facSpComment) as Array<FacSpComment>;

    //Faculty comments are not tied to person, so do not search for faculty id when looking for faculty comments!
    let facComment = facComments.filter(comment => comment.recipientPersonId === assesseeId && comment.courseId === courseId && comment.workGroupId === groupId)[0];

    if (!facComment) {
      facComment = this.manager.createEntity(MpEntityType.facSpComment, { recipientPersonId: assesseeId, courseId: courseId, workGroupId: groupId }) as FacSpComment;

      const commentFlags = this.manager.getEntities(MpEntityType.facSpCommentFlag) as Array<FacSpCommentFlag>;

      let commentFlag = commentFlags.filter(flag => flag.recipientPersonId === assesseeId && flag.courseId === courseId && flag.workGroupId === groupId)[0];

      if (!commentFlag) {
        commentFlag = this.manager.createEntity(MpEntityType.facSpCommentFlag, { recipientPersonId: assesseeId, courseId: courseId, workGroupId: groupId }) as FacSpCommentFlag;
        commentFlag.mpAuthor = MpCommentFlag.neut;
      }

      facComment.facultyPersonId = userId;
      facComment.flag = commentFlag;
    }

    return facComment;
  }

  getSingleStrat(courseId: number, groupId: number, studentId: number) {

    const loggedUserId = this.global.persona.value.person.personId;

    const existingStrat = this.manager.getEntityByKey(MpEntityType.facStratResponse, [studentId, courseId, groupId]) as FacStratResponse;

    return (existingStrat) ? existingStrat :
      this.manager.createEntity(MpEntityType.facStratResponse, {
        assesseePersonId: studentId,
        facultyPersonId: loggedUserId,
        courseId: courseId,
        workGroupId: groupId
      }) as FacStratResponse;
  }

  fetchActiveWgSpComments(courseId: number, groupId: number, forceRefresh?: boolean): Promise<Array<StudSpComment>> {
    let spComments = this.manager.getEntities(MpEntityType.spComment) as Array<StudSpComment>;
    let activeWgComments = spComments.filter(com => com.workGroupId === groupId);

    if (forceRefresh) {
      if (activeWgComments) {
        activeWgComments.forEach(comment => this.manager.detachEntity(comment));
      }
    }

    if (activeWgComments.length > 0 && !forceRefresh) {
      console.log('WorkGroup loaded from local cache');
      return Promise.resolve(activeWgComments);
    }

    const params = { courseId: courseId, workGroupId: groupId };

    let query = EntityQuery.from(this.facultyApiResource.wgComment.resource).withParameters(params);

    return <Promise<Array<StudSpComment>>>this.manager.executeQuery(query)
      .then(wgCommentResponse)
      .catch(this.queryFailed);

    function wgCommentResponse(data: QueryResult) {
      let comments = data.results as Array<StudSpComment>;

      // if (!comments) {
      //   const error = {
      //     errorMessage: 'Did not get any comments from the server'
      //   }
      //   console.log('Query succeeded, but no comments were returned', data, false);
      //   return Promise.reject(() => error) as any;
      // }

      return comments;
    }
  }


  fetchGrpMemsWithSpResults(courseId: number, groupId: number, forcedRefresh?: boolean): Promise<Array<CrseStudentInGroup> | Promise<void>> {
    const that = this;

    let workGroup = this.manager.getEntityByKey(MpEntityType.workGroup, groupId) as WorkGroup;

    const resultCached = this.manager.getEntities(MpEntityType.crseStudInGrp) as Array<CrseStudentInGroup>;

    if (resultCached && !forcedRefresh) {
      const members = resultCached.filter(gm => gm.workGroupId === groupId && gm.courseId === courseId);
      if (members && members.length !== 0) {
        if (members.every(member => member.stratResult !== null) && members.every(member => member.spResult !== null) && members.every(member => member.assesseeStratResponse.length !== 0) && members.every(member => member.assesseeSpResponses.length !== 0)) {
          const cachedInstrument = that.manager.getEntityByKey(MpEntityType.spInstr, workGroup.assignedSpInstrId) as SpInstrument;
          const cachedInventory = cachedInstrument.inventoryCollection as Array<SpInventory>;
          cachedInventory
            .forEach(inv => {
              inv.resetResult();
              inv.workGroup = workGroup;
            });
          console.log('Retrieved workgroup result from the local cache', resultCached, false);

          return Promise.resolve(members);
        }
      }
    }

    const params: any = { courseId: courseId, workGroupId: groupId };
    let query: any = EntityQuery.from(this.facultyApiResource.wgResult.resource).withParameters(params);

    const studentResults = <Promise<CrseStudentInGroup[]>>this.manager.executeQuery(query)
      .then(activeWgResultResponse)
      .catch(this.queryFailed);

    function activeWgResultResponse(data: QueryResult): Array<CrseStudentInGroup> {

      workGroup = data.results[0] as WorkGroup;

      if (workGroup.groupMembers) {

        if (workGroup.groupMembers.some(gm => gm.spResult === null)) {
          console.log('No published data was found for this workGroup');

          const queryError: any = {
            errorMessage: 'No published data was found for this workgroup'
          }

          return Promise.reject(queryError) as any;
        }
      }

      console.log('Fetched course student in groups result from the remote data store', workGroup.groupMembers, false);

      return workGroup.groupMembers;
    }

    const promise1 = studentResults;
    const promise2 = this.fetchSpInstrument(workGroup.assignedSpInstrId, forcedRefresh);
    const promise3 = this.fetchActiveWgSpComments(courseId, groupId, forcedRefresh);
    const promise4 = this.fetchActiveWgFacComments(courseId, groupId, forcedRefresh);
    return Promise.all([promise1, promise2, promise3, promise4]).then((results: Array<any>) => {
      const instrument = results[1] as SpInstrument;
      const inventory = instrument.inventoryCollection as Array<SpInventory>;
      inventory
        .forEach(inv => {
          inv.resetResult();
        });
      return results[0];
    });
  }

  fetchSpInstrument(instrumentId: number, forceRefresh?: boolean): Promise<SpInstrument | Promise<void>> {
    const that = this;
    let instrument: SpInstrument;

    instrument = this.manager.getEntityByKey(MpEntityType.spInstr, instrumentId) as SpInstrument;

    if (instrument) {

      if (instrument.inventoryCollection && instrument.inventoryCollection.length > 0) {
        console.log('Instrument loaded from local cache', instrument, false);
        return Promise.resolve(instrument);
      }
    }

    const params: any = { instrumentId: instrumentId }
    let query: any = EntityQuery.from(this.facultyApiResource.instrument.resource).withParameters(params);

    return <Promise<SpInstrument>>this.manager.executeQuery(query)
      .then(fetchActiveCrseReponse)
      .catch(this.queryFailed);

    function fetchActiveCrseReponse(data: QueryResult) {

      instrument = data.results[0] as SpInstrument;

      if (!instrument) {
        const error: any = {
          errorMessage: 'An active instrument was not received from the server.'
        }
        console.log('Query succeeded, but the course membership did not return a result', data, false);
        return Promise.reject(error) as any;
      }

      console.log('Instrument loaded from remote data source', instrument, false);
      return instrument;
    }
  }

  fetchActiveWgFacComments(courseId: number, groupId: number, forceRefresh?: boolean): Promise<Array<FacSpComment> | Promise<void>> {

    const that = this;
    let facComments: Array<FacSpComment>;

    const allFacComments = this.manager.getEntities(MpEntityType.facSpComment) as Array<FacSpComment>;

    if (allFacComments) {
      facComments = allFacComments.filter(comment => comment.courseId === courseId && comment.workGroupId === groupId);

      if (facComments && facComments.length > 0) {
        console.log('Retrieved SpComments from local cache', facComments, false);
        return Promise.resolve(facComments);
      }
    }

    const params: any = { courseId: courseId, workGroupId: groupId };
    let query: any = EntityQuery.from(this.facultyApiResource.wgComment.resource).withParameters(params);

    return <Promise<FacSpComment[]>>this.manager.executeQuery(query)
      .then(fetchActiveWgFacCommentResponse)
      .catch(this.queryFailed);


    function fetchActiveWgFacCommentResponse(data: QueryResult): Array<FacSpComment> {
      facComments = data.results as Array<FacSpComment>;
      if (!facComments || facComments.length === 0) {
        return null;
      }

      console.log('Retrieved SpComment for remote data source', facComments, false);
      return facComments;
    }
  }


}
