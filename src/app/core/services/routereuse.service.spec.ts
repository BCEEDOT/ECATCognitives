import { TestBed, inject } from '@angular/core/testing';

import { RoutereuseService } from './routereuse.service';

describe('RoutereuseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutereuseService]
    });
  });

  it('should be created', inject([RoutereuseService], (service: RoutereuseService) => {
    expect(service).toBeTruthy();
  }));
});
