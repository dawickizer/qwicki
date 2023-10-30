import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

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

  panelOpenState = false;

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

  isInboundFriendRequestsComponent(): boolean {
    return this.title === 'friend requests';
  }

  sendFriendRequest() {
    this.socialOrchestratorService
      .sendFriendRequest(this.potentialFriend)
      .subscribe();
    this.potentialFriend = '';
  }

  addNewFriend(friendRequest: FriendRequest) {
    this.socialOrchestratorService.addNewFriend(friendRequest).subscribe();
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService
      .rejectFriendRequest(friendRequest)
      .subscribe();
  }

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService
      .revokeFriendRequest(friendRequest)
      .subscribe();
  }
}
