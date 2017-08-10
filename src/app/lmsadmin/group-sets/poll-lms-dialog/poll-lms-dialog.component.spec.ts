import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollLmsDialogComponent } from './poll-lms-dialog.component';

describe('PollLmsDialogComponent', () => {
  let component: PollLmsDialogComponent;
  let fixture: ComponentFixture<PollLmsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollLmsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollLmsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
