import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundFriendRequestsComponent } from './inbound-friend-requests.component';

describe('InboundFriendRequestsComponent', () => {
  let component: InboundFriendRequestsComponent;
  let fixture: ComponentFixture<InboundFriendRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InboundFriendRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InboundFriendRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
