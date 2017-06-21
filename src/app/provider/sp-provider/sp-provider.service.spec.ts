import { TestBed, inject } from '@angular/core/testing';

import { SpProviderService } from './sp-provider.service';

describe('SpProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpProviderService]
    });
  });

  it('should ...', inject([SpProviderService], (service: SpProviderService) => {
    expect(service).toBeTruthy();
  }));
});
