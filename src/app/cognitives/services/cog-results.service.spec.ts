import { TestBed, inject } from '@angular/core/testing';

import { CogResultsService } from './cog-results.service';

describe('CogResultsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CogResultsService]
    });
  });

  it('should be created', inject([CogResultsService], (service: CogResultsService) => {
    expect(service).toBeTruthy();
  }));
});
