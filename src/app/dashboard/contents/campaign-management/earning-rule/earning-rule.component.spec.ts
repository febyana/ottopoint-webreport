import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningRuleComponent } from './earning-rule.component';

describe('EarningRuleComponent', () => {
  let component: EarningRuleComponent;
  let fixture: ComponentFixture<EarningRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
