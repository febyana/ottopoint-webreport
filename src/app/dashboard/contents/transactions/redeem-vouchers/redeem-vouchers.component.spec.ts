import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemVouchersComponent } from './redeem-vouchers.component';

describe('RedeemVouchersComponent', () => {
  let component: RedeemVouchersComponent;
  let fixture: ComponentFixture<RedeemVouchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemVouchersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
