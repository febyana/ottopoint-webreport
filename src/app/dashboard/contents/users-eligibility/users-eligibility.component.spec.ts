import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersEligibilityComponent } from './users-eligibility.component';

describe('UsersEligibilityComponent', () => {
  let component: UsersEligibilityComponent;
  let fixture: ComponentFixture<UsersEligibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersEligibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
