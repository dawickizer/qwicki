import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFriendRequestsListComponent } from './social-friend-requests-list.component';

describe('SocialFriendRequestsListComponent', () => {
  let component: SocialFriendRequestsListComponent;
  let fixture: ComponentFixture<SocialFriendRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialFriendRequestsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialFriendRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
