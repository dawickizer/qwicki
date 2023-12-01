import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Notification } from 'src/app/models/notification/notification';
import { FriendRequestOrchestratorService } from 'src/app/state/friend-request/friend-request.orchestrator.service';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { Invite } from 'src/app/state/invite/invite.model';
import { InviteOrchestratorService } from 'src/app/state/invite/invite.orchestrator.service';

@Component({
  selector: 'app-outbound-notifications',
  templateUrl: './outbound-notifications.component.html',
  styleUrls: ['./outbound-notifications.component.css'],
})
export class OutboundNotificationsComponent {
  @Input() notifications: MatTableDataSource<Notification>;
  notificationsDisplayedColumns: string[] = ['username', 'action'];

  panelOpenState = false;

  constructor(
    private friendRequestOrchestratorService: FriendRequestOrchestratorService,
    private inviteOrchestratorService: InviteOrchestratorService
  ) {}

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestOrchestratorService
      .revokeFriendRequest(friendRequest)
      .subscribe();
  }

  revokeInvite(invite: Invite) {
    this.inviteOrchestratorService.revokeInvite(invite).subscribe();
  }

  isFriendRequest(notification: Notification) {
    return notification.type === 'friend-request';
  }
}
