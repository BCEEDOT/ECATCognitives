import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupsetComponent } from './manage-groupset.component';

describe('ManageGroupsetComponent', () => {
  let component: ManageGroupsetComponent;
  let fixture: ComponentFixture<ManageGroupsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGroupsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
