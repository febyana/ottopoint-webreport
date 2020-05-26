import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UltravoucherComponent } from './ultravoucher.component';

describe('UltravoucherComponent', () => {
  let component: UltravoucherComponent;
  let fixture: ComponentFixture<UltravoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltravoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UltravoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
