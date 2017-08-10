import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmspeResultComponent } from './ecmspe-result.component';

describe('EcmspeResultComponent', () => {
  let component: EcmspeResultComponent;
  let fixture: ComponentFixture<EcmspeResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcmspeResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcmspeResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
