import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-inbound-friend-requests',
  templateUrl: './inbound-friend-requests.component.html',
  styleUrls: ['./inbound-friend-requests.component.css'],
})
export class InboundFriendRequestsComponent {
  @Input() friendRequests: MatTableDataSource<FriendRequest>;
  friendRequestsDisplayedColumns: string[] = ['username', 'action'];

  potentialFriend: string;

  panelOpenState = false;

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

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
}
