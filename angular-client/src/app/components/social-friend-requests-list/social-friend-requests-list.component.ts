import { Component, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { FriendRequestService } from 'src/app/state/friend-request/friend-request.service';

@Component({
  selector: 'app-social-friend-requests-list',
  templateUrl: './social-friend-requests-list.component.html',
  styleUrls: ['./social-friend-requests-list.component.css'],
})
export class SocialFriendRequestsListComponent implements OnDestroy {
  @Input() title: string;
  @Input() titleColor: string;

  @Input() friendRequests: MatTableDataSource<FriendRequest>;
  friendRequestsDisplayedColumns: string[] = ['username', 'action'];

  potentialFriend: string;

  unsubscribe$ = new Subject<void>();

  constructor(private friendRequestService: FriendRequestService) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isInboundFriendRequestsComponent(): boolean {
    return this.title === 'friend requests';
  }

  sendFriendRequest() {
    this.friendRequestService
      .sendFriendRequest(this.potentialFriend)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
    this.potentialFriend = '';
  }

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestService
      .acceptFriendRequest(friendRequest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestService
      .rejectFriendRequest(friendRequest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestService
      .revokeFriendRequest(friendRequest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}
