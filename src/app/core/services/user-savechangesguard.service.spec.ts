import { TestBed, inject } from '@angular/core/testing';

import { UserSaveChangesGuard } from './user-savechangesguard.service';

describe('SavechangesguardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSaveChangesGuard]
    });
  });

  it('should be created', inject([UserSaveChangesGuard], (service: UserSaveChangesGuard) => {
    expect(service).toBeTruthy();
  }));
});
