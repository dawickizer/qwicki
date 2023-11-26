import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Notification } from 'src/app/models/notification/notification';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { Invite } from 'src/app/state/invite/invite.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-inbound-notifications',
  templateUrl: './inbound-notifications.component.html',
  styleUrls: ['./inbound-notifications.component.css'],
})
export class InboundNotificationsComponent {
  @Input() notifications: MatTableDataSource<Notification>;
  notificationsDisplayedColumns: string[] = ['username', 'action'];

  panelOpenState = false;

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService.addNewFriend(friendRequest).subscribe();
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService
      .rejectFriendRequest(friendRequest)
      .subscribe();
  }

  acceptInvite(invite: Invite) {
    this.socialOrchestratorService.acceptInvite(invite).subscribe();
  }

  rejectInvite(invite: Invite) {
    this.socialOrchestratorService.rejectInvite(invite).subscribe();
  }

  isFriendRequest(notification: Notification) {
    return notification.type === 'friend-request';
  }
}
