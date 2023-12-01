import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Notification } from 'src/app/models/notification/notification';
import { FriendRequestOrchestratorService } from 'src/app/state/friend-request/friend-request.orchestrator.service';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { FriendOrchestratorService } from 'src/app/state/friend/friend.orchestrator.service';
import { Invite } from 'src/app/state/invite/invite.model';
import { InviteOrchestratorService } from 'src/app/state/invite/invite.orchestrator.service';

@Component({
  selector: 'app-inbound-notifications',
  templateUrl: './inbound-notifications.component.html',
  styleUrls: ['./inbound-notifications.component.css'],
})
export class InboundNotificationsComponent {
  @Input() notifications: MatTableDataSource<Notification>;
  notificationsDisplayedColumns: string[] = ['username', 'action'];

  panelOpenState = false;

  constructor(
    private friendRequestOrchestratorService: FriendRequestOrchestratorService,
    private friendOrchestratorService: FriendOrchestratorService,
    private inviteOrchestratorService: InviteOrchestratorService
  ) {}

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.friendOrchestratorService.addNewFriend(friendRequest).subscribe();
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.friendRequestOrchestratorService
      .rejectFriendRequest(friendRequest)
      .subscribe();
  }

  acceptInvite(invite: Invite) {
    this.inviteOrchestratorService.acceptInvite(invite).subscribe();
  }

  rejectInvite(invite: Invite) {
    this.inviteOrchestratorService.rejectInvite(invite).subscribe();
  }

  isFriendRequest(notification: Notification) {
    return notification.type === 'friend-request';
  }
}
