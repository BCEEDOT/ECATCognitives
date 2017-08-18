import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishGroupsetComponent } from './publish-groupset.component';

describe('PublishGroupsetComponent', () => {
  let component: PublishGroupsetComponent;
  let fixture: ComponentFixture<PublishGroupsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishGroupsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishGroupsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
