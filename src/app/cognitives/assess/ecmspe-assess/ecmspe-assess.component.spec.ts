import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmspeAssessComponent } from './ecmspe-assess.component';

describe('EcmspeAssessComponent', () => {
  let component: EcmspeAssessComponent;
  let fixture: ComponentFixture<EcmspeAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcmspeAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcmspeAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
