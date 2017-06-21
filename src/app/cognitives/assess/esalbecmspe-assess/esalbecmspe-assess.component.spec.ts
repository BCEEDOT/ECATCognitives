import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalbecmspeAssessComponent } from './esalbecmspe-assess.component';

describe('EsalbecmspeAssessComponent', () => {
  let component: EsalbecmspeAssessComponent;
  let fixture: ComponentFixture<EsalbecmspeAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsalbecmspeAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsalbecmspeAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
