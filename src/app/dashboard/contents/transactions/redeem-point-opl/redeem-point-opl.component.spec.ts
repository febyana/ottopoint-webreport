import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemPointOplComponent } from './redeem-point-opl.component';

describe('RedeemPointOplComponent', () => {
  let component: RedeemPointOplComponent;
  let fixture: ComponentFixture<RedeemPointOplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemPointOplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemPointOplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
