import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcpeAssessComponent } from './ecpe-assess.component';

describe('EcpeAssessComponent', () => {
  let component: EcpeAssessComponent;
  let fixture: ComponentFixture<EcpeAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcpeAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcpeAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
