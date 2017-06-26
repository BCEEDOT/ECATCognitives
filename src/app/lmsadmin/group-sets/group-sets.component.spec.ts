import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSetsComponent } from './group-sets.component';

describe('GroupSetsComponent', () => {
  let component: GroupSetsComponent;
  let fixture: ComponentFixture<GroupSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
