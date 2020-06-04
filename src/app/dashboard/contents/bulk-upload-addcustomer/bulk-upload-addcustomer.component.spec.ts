import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadAddcustomerComponent } from './bulk-upload-addcustomer.component';

describe('BulkUploadAddcustomerComponent', () => {
  let component: BulkUploadAddcustomerComponent;
  let fixture: ComponentFixture<BulkUploadAddcustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadAddcustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadAddcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
