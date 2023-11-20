import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { Invite } from 'src/app/state/invite/invite.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-outbound-notifications',
  templateUrl: './outbound-notifications.component.html',
  styleUrls: ['./outbound-notifications.component.css'],
})
export class OutboundNotificationsComponent {
  @Input() friendRequests: MatTableDataSource<FriendRequest>;
  friendRequestsDisplayedColumns: string[] = ['username', 'action'];

  @Input() invites: MatTableDataSource<Invite>;
  invitesDisplayedColumns: string[] = ['username', 'action'];

  panelOpenState = false;

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService
      .revokeFriendRequest(friendRequest)
      .subscribe();
  }

  revokeInvite(invite: Invite) {
    this.socialOrchestratorService
      .revokeInvite(invite)
      .subscribe();
  }
}
