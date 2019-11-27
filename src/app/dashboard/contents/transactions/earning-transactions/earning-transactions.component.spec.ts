import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningTransactionsComponent } from './earning-transactions.component';

describe('EarningTransactionsComponent', () => {
  let component: EarningTransactionsComponent;
  let fixture: ComponentFixture<EarningTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
