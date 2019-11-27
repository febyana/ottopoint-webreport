import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsEarningsQRComponent } from './transactions-earnings-qr.component';

describe('TransactionsEarningsQRComponent', () => {
  let component: TransactionsEarningsQRComponent;
  let fixture: ComponentFixture<TransactionsEarningsQRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsEarningsQRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsEarningsQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
