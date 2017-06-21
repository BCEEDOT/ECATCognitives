import { TestBed, inject } from '@angular/core/testing';

import { FacultyDataContextService } from './faculty-data-context.service';

describe('FacultyDataContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacultyDataContextService]
    });
  });

  it('should be created', inject([FacultyDataContextService], (service: FacultyDataContextService) => {
    expect(service).toBeTruthy();
  }));
});
