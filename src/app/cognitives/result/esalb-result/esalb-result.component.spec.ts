import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalbResultComponent } from './esalb-result.component';

describe('EsalbResultComponent', () => {
  let component: EsalbResultComponent;
  let fixture: ComponentFixture<EsalbResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsalbResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsalbResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
