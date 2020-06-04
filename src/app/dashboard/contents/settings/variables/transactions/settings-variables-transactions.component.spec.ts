import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsVariablesTransactionsComponent } from './settings-variables-transactions.component';

describe('SettingsVariablesTransactionsComponent', () => {
  let component: SettingsVariablesTransactionsComponent;
  let fixture: ComponentFixture<SettingsVariablesTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsVariablesTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsVariablesTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
