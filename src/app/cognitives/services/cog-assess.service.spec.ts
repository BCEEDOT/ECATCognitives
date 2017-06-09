import { TestBed, inject } from '@angular/core/testing';

import { CogAssessService } from './cog-assess.service';

describe('CogAssessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CogAssessService]
    });
  });

  it('should be created', inject([CogAssessService], (service: CogAssessService) => {
    expect(service).toBeTruthy();
  }));
});
