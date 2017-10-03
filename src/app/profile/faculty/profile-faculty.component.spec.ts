import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFacultyComponent } from './profile-faculty.component';

describe('ProfileFacultyComponent', () => {
  let component: ProfileFacultyComponent;
  let fixture: ComponentFixture<ProfileFacultyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFacultyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
