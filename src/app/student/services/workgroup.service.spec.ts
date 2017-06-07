import { TestBed, inject } from '@angular/core/testing';

import { WorkGroupService } from './workgroup.service';

describe('WorkGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkgroupService]
    });
  });

  it('should ...', inject([WorkgroupService], (service: WorkGroupService) => {
    expect(service).toBeTruthy();
  }));
});
