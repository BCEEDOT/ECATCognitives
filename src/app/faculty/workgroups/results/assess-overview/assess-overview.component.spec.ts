import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessOverviewComponent } from './assess-overview.component';

describe('AssessOverviewComponent', () => {
  let component: AssessOverviewComponent;
  let fixture: ComponentFixture<AssessOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
