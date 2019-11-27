import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersRedeemComponent } from './vouchers-redeem.component';

describe('VouchersRedeemComponent', () => {
  let component: VouchersRedeemComponent;
  let fixture: ComponentFixture<VouchersRedeemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersRedeemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersRedeemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
