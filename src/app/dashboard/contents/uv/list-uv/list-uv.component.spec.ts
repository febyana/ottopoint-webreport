import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUvComponent } from './list-uv.component';

describe('ListUvComponent', () => {
  let component: ListUvComponent;
  let fixture: ComponentFixture<ListUvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
