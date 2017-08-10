import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcpeResultComponent } from './ecpe-result.component';

describe('EcpeResultComponent', () => {
  let component: EcpeResultComponent;
  let fixture: ComponentFixture<EcpeResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcpeResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcpeResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
