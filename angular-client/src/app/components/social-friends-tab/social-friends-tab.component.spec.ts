import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFriendsTabComponent } from './social-friends-tab.component';

describe('SocialFriendsTabComponent', () => {
  let component: SocialFriendsTabComponent;
  let fixture: ComponentFixture<SocialFriendsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialFriendsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialFriendsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
