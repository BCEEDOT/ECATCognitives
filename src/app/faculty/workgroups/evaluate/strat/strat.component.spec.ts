import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StratComponent } from './strat.component';

describe('StratComponent', () => {
  let component: StratComponent;
  let fixture: ComponentFixture<StratComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StratComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
