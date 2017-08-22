import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteBackComponent } from './route-back.component';

describe('RouteBackComponent', () => {
  let component: RouteBackComponent;
  let fixture: ComponentFixture<RouteBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
