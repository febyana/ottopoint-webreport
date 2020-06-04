import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemVoucherOplComponent } from './redeem-voucher-opl.component';

describe('RedeemVoucherOplComponent', () => {
  let component: RedeemVoucherOplComponent;
  let fixture: ComponentFixture<RedeemVoucherOplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemVoucherOplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemVoucherOplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
