import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentQrsComponent } from './payment-qrs.component';

describe('PaymentQrsComponent', () => {
  let component: PaymentQrsComponent;
  let fixture: ComponentFixture<PaymentQrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentQrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentQrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
