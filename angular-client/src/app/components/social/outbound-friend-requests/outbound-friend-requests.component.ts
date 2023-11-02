import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-outbound-friend-requests',
  templateUrl: './outbound-friend-requests.component.html',
  styleUrls: ['./outbound-friend-requests.component.css'],
})
export class OutboundFriendRequestsComponent {
  @Input() friendRequests: MatTableDataSource<FriendRequest>;
  friendRequestsDisplayedColumns: string[] = ['username', 'action'];

  panelOpenState = false;

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService
      .revokeFriendRequest(friendRequest)
      .subscribe();
  }
}
