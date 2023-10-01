import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { UserStateService } from 'src/app/state/user/user.state.service';

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

  constructor(private userStateService: UserStateService) {}

  isInboundFriendRequestsComponent(): boolean {
    return this.title === 'friend requests';
  }

  sendFriendRequest() {
    this.userStateService.sendFriendRequest(this.potentialFriend);
    this.potentialFriend = '';
  }

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.userStateService.acceptFriendRequest(friendRequest);
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.userStateService.rejectFriendRequest(friendRequest);
  }

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.userStateService.revokeFriendRequest(friendRequest);
  }
}
