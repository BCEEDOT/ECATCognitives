import { TestBed, inject } from '@angular/core/testing';

import { FacultyAuthGuardService } from './faculty-auth-guard.service';

describe('FacultyAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacultyAuthGuardService]
    });
  });

  it('should be created', inject([FacultyAuthGuardService], (service: FacultyAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
