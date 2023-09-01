import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFriendsListComponent } from './social-friends-list.component';

describe('SocialFriendsListComponent', () => {
  let component: SocialFriendsListComponent;
  let fixture: ComponentFixture<SocialFriendsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialFriendsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialFriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
