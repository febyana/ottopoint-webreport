import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewStoreComponent } from './add-new-store.component';

describe('AddNewStoreComponent', () => {
  let component: AddNewStoreComponent;
  let fixture: ComponentFixture<AddNewStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
