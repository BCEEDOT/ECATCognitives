import { TestBed, inject } from '@angular/core/testing';

import { FacultySaveChangesGuard } from './faculty-savechangesguard.service';

describe('SavechangesguardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacultySaveChangesGuard]
    });
  });

  it('should be created', inject([FacultySaveChangesGuard], (service: FacultySaveChangesGuard) => {
    expect(service).toBeTruthy();
  }));
});
