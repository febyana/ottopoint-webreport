import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningRulesComponent } from './earning-rules.component';

describe('EarningRulesComponent', () => {
  let component: EarningRulesComponent;
  let fixture: ComponentFixture<EarningRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
