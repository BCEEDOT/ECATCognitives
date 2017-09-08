import { TestBed, inject } from '@angular/core/testing';

import { WorkGroupService } from './workgroup.service';

describe('WorkGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkGroupService]
    });
  });

  it('should ...', inject([WorkGroupService], (service: WorkGroupService) => {
    expect(service).toBeTruthy();
  }));
});
