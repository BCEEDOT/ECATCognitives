import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StratOverviewComponent } from './strat-overview.component';

describe('StratOverviewComponent', () => {
  let component: StratOverviewComponent;
  let fixture: ComponentFixture<StratOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StratOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StratOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
