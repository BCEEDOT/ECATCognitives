import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadrunnerLocationsComponent } from './roadrunner-locations.component';

describe('RoadrunnerLocationsComponent', () => {
  let component: RoadrunnerLocationsComponent;
  let fixture: ComponentFixture<RoadrunnerLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadrunnerLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadrunnerLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
