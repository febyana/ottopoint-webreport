import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrTransactionsComponent } from './qr-transactions.component';

describe('QrTransactionsComponent', () => {
  let component: QrTransactionsComponent;
  let fixture: ComponentFixture<QrTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
