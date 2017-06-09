import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtmpreAssessComponent } from './etmpre-assess.component';

describe('EtmpreAssessComponent', () => {
  let component: EtmpreAssessComponent;
  let fixture: ComponentFixture<EtmpreAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtmpreAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtmpreAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
