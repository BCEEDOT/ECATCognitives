import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsadminComponent } from './lmsadmin.component';

describe('LmsadminComponent', () => {
  let component: LmsadminComponent;
  let fixture: ComponentFixture<LmsadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmsadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
