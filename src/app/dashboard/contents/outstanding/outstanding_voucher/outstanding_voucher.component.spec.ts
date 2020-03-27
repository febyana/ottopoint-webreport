import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingVoucherComponent } from './outstanding_voucher.component';

describe('OutstandingVoucherComponent', () => {
  let component: OutstandingVoucherComponent;
  let fixture: ComponentFixture<OutstandingVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
