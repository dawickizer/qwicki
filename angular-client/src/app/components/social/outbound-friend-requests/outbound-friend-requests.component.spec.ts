import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundFriendRequestsComponent } from './outbound-friend-requests.component';

describe('OutboundFriendRequestsComponent', () => {
  let component: OutboundFriendRequestsComponent;
  let fixture: ComponentFixture<OutboundFriendRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutboundFriendRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboundFriendRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
