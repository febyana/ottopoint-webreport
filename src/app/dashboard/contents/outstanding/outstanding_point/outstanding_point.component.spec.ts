import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPointComponent } from './outstanding_point.component';

describe('OutstandingPointComponent', () => {
  let component: OutstandingPointComponent;
  let fixture: ComponentFixture<OutstandingPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
