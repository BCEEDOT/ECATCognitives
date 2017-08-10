import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightRosterComponent } from './flight-roster.component';

describe('FlightRosterComponent', () => {
  let component: FlightRosterComponent;
  let fixture: ComponentFixture<FlightRosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
