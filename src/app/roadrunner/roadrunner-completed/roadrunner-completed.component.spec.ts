import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadrunnerCompletedComponent } from './roadrunner-completed.component';

describe('RoadrunnerCompletedComponent', () => {
  let component: RoadrunnerCompletedComponent;
  let fixture: ComponentFixture<RoadrunnerCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadrunnerCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadrunnerCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
