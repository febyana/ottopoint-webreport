import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsEarningsEarningoplComponent } from './transactions-earnings-earningopl.component';

describe('TransactionsEarningsEarningoplComponent', () => {
  let component: TransactionsEarningsEarningoplComponent;
  let fixture: ComponentFixture<TransactionsEarningsEarningoplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsEarningsEarningoplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsEarningsEarningoplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
