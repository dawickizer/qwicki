import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { FriendRequestsStateService } from 'src/app/state/friend-requests/friend-requests.state.service';

@Component({
  selector: 'app-social-friend-requests-list',
  templateUrl: './social-friend-requests-list.component.html',
  styleUrls: ['./social-friend-requests-list.component.css'],
})
export class SocialFriendRequestsListComponent {
  @Input() title: string;
  @Input() titleColor: string;

  @Input() friendRequests: MatTableDataSource<FriendRequest>;
  friendRequestsDisplayedColumns: string[] = ['username', 'action'];

  potentialFriend: string;

  constructor(private friendRequestsStateService: FriendRequestsStateService) {}

  isInboundFriendRequestsComponent(): boolean {
    return this.title === 'friend requests';
  }

  sendFriendRequest() {
    this.friendRequestsStateService.sendFriendRequest(this.potentialFriend);
    this.potentialFriend = '';
  }

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestsStateService.acceptFriendRequest(friendRequest);
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestsStateService.rejectFriendRequest(friendRequest);
  }

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestsStateService.revokeFriendRequest(friendRequest);
  }
}
