import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsEarningsOspComponent } from './transactions-earnings-osp.component';

describe('TransactionsEarningsOspComponent', () => {
  let component: TransactionsEarningsOspComponent;
  let fixture: ComponentFixture<TransactionsEarningsOspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsEarningsOspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsEarningsOspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
