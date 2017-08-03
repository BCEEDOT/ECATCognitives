import { TestBed, inject } from '@angular/core/testing';

import { LmsadminDataContextService } from './lmsadmin-data-context.service';

describe('LmsadminDataContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LmsadminDataContextService]
    });
  });

  it('should be created', inject([LmsadminDataContextService], (service: LmsadminDataContextService) => {
    expect(service).toBeTruthy();
  }));
});
