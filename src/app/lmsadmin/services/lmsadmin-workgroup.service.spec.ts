import { TestBed, inject } from '@angular/core/testing';

import { LmsadminWorkgroupService } from './lmsadmin-workgroup.service';

describe('LmsadminWorkgroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LmsadminWorkgroupService]
    });
  });

  it('should be created', inject([LmsadminWorkgroupService], (service: LmsadminWorkgroupService) => {
    expect(service).toBeTruthy();
  }));
});
