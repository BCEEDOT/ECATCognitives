import { TestBed, inject } from '@angular/core/testing';

import { ValuesService } from './values.service';

describe('ValuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValuesService]
    });
  });

  it('should ...', inject([ValuesService], (service: ValuesService) => {
    expect(service).toBeTruthy();
  }));
});
