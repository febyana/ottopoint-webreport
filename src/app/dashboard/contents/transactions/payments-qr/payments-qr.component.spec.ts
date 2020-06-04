import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsQRComponent } from './payments-qr.component';

describe('PaymentsQRComponent', () => {
  let component: PaymentsQRComponent;
  let fixture: ComponentFixture<PaymentsQRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsQRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
