import { TestBed, inject } from '@angular/core/testing';

import { FacworkgroupService } from './facworkgroup.service';

describe('FacworkgroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacworkgroupService]
    });
  });

  it('should be created', inject([FacworkgroupService], (service: FacworkgroupService) => {
    expect(service).toBeTruthy();
  }));
});
