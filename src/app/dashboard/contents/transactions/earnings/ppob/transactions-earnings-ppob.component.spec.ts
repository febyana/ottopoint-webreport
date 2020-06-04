import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsEarningsPPOBComponent } from './transactions-earnings-ppob.component';

describe('TransactionsEarningsPPOBComponent', () => {
  let component: TransactionsEarningsPPOBComponent;
  let fixture: ComponentFixture<TransactionsEarningsPPOBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsEarningsPPOBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsEarningsPPOBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
