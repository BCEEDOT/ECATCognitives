import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveStudentDialogComponent } from './move-student-dialog.component';

describe('MoveStudentDialogComponent', () => {
  let component: MoveStudentDialogComponent;
  let fixture: ComponentFixture<MoveStudentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveStudentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveStudentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
