import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtmpreResultComponent } from './etmpre-result.component';

describe('EtmpreResultComponent', () => {
  let component: EtmpreResultComponent;
  let fixture: ComponentFixture<EtmpreResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtmpreResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtmpreResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
