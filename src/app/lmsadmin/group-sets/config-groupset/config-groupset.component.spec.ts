import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigGroupsetComponent } from './config-groupset.component';

describe('ConfigGroupsetComponent', () => {
  let component: ConfigGroupsetComponent;
  let fixture: ComponentFixture<ConfigGroupsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigGroupsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigGroupsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
