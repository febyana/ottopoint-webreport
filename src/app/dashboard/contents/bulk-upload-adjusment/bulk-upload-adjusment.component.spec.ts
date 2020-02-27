import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadAdjusmentComponent } from './bulk-upload-adjusment.component';

describe('BulkUploadAdjusmentComponent', () => {
  let component: BulkUploadAdjusmentComponent;
  let fixture: ComponentFixture<BulkUploadAdjusmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadAdjusmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadAdjusmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
