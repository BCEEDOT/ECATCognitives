import { TestBed, inject } from '@angular/core/testing';

import { LmsadminAuthGuardService } from './lmsadmin-auth-guard.service';

describe('LmsadminAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LmsadminAuthGuardService]
    });
  });

  it('should be created', inject([LmsadminAuthGuardService], (service: LmsadminAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
