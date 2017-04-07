import { TestBed, inject } from '@angular/core/testing';

import { EmProviderService } from './em-provider.service';

describe('EmProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmProviderService]
    });
  });

  it('should ...', inject([EmProviderService], (service: EmProviderService) => {
    expect(service).toBeTruthy();
  }));
});
