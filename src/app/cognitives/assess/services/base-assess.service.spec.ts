import { TestBed, inject } from '@angular/core/testing';

import { BaseAssessService } from './base-assess.service';

describe('BaseAssessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseAssessService]
    });
  });

  it('should be created', inject([BaseAssessService], (service: BaseAssessService) => {
    expect(service).toBeTruthy();
  }));
});
