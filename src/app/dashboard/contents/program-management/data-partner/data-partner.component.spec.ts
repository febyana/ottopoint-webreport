import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPartnerComponent } from './data-partner.component';

describe('DataPartnerComponent', () => {
  let component: DataPartnerComponent;
  let fixture: ComponentFixture<DataPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
