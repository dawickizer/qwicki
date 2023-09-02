import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialGroupsTabComponent } from './social-groups-tab.component';

describe('SocialGroupsTabComponent', () => {
  let component: SocialGroupsTabComponent;
  let fixture: ComponentFixture<SocialGroupsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialGroupsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialGroupsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
