import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutebackComponent } from './routeback.component';

describe('RoutebackComponent', () => {
  let component: RoutebackComponent;
  let fixture: ComponentFixture<RoutebackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutebackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutebackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
