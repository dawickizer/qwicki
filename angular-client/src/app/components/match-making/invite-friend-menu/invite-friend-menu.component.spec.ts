import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFriendMenuComponent } from './invite-friend-menu.component';

describe('InviteFriendMenuComponent', () => {
  let component: InviteFriendMenuComponent;
  let fixture: ComponentFixture<InviteFriendMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteFriendMenuComponent],
    });
    fixture = TestBed.createComponent(InviteFriendMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
