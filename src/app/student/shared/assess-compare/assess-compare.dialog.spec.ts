import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessCompareDialog } from './assess-compare.dialog';

describe('AssessCompareComponent', () => {
  let component: AssessCompareDialog;
  let fixture: ComponentFixture<AssessCompareDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessCompareDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessCompareDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
