import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardCampaignsComponent } from './reward-campaigns.component';

describe('RewardCampaignsComponent', () => {
  let component: RewardCampaignsComponent;
  let fixture: ComponentFixture<RewardCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
