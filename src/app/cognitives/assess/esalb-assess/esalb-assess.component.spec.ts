import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalbAssessComponent } from './esalb-assess.component';

describe('EsalbAssessComponent', () => {
  let component: EsalbAssessComponent;
  let fixture: ComponentFixture<EsalbAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsalbAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsalbAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
