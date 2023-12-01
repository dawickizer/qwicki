import { Injectable } from '@angular/core';
import { FriendService } from '../friend/friend.service';
import { InboxService } from '../inbox/inbox.service';
import { Friend } from '../friend/friend.model';
import { Room } from 'colyseus.js';
import { Message } from '../message/message.model';
import { MessageService } from '../message/message.service';
import { InviteService } from '../invite/invite.service';
import { Invite } from '../invite/invite.model';
import { Status } from 'src/app/models/status/status.model';
import { FriendRequest } from '../friend-request/friend-requests.model';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class InboxOnMessageService {
  user: User;

  constructor(
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    private inboxService: InboxService,
    private messageService: MessageService,
    private inviteService: InviteService,
    private userService: UserService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.userService.user$.subscribe(user => (this.user = user));
  }

  setPersonalInboxListeners(inbox: Room): Room {
    inbox.onMessage('messageHost', (message: Message) => {
      this.messageService.addMessageToFriend(message.from, message);
      this.friendService.reorderFriend(message.from._id, 'front');
    });

    inbox.onMessage(
      'userIsTyping',
      (data: { friendId: string; isTyping: boolean }) => {
        this.friendService.setFriendIsTyping(data.friendId, data.isTyping);
      }
    );

    inbox.onMessage('status', (friend: { id: string; status: Status }) => {
      this.friendService.updateFriendStatus(friend.id, friend.status);
    });

    inbox.onMessage('sendFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.receiveFriendRequest(friendRequest).subscribe();
    });

    inbox.onMessage('rejectFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.removeOutboundFriendRequest(friendRequest);
    });

    inbox.onMessage('revokeFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.removeInboundFriendRequest(friendRequest);
    });

    inbox.onMessage(
      'acceptFriendRequest',
      (data: { friendRequest: FriendRequest; status: Status }) => {
        this.friendRequestService.removeOutboundFriendRequest(
          data.friendRequest
        );
        this.friendService.addFriend(data.friendRequest.to);
        this.friendService.updateFriendStatus(
          data.friendRequest.to._id,
          data.status
        );

        this.messageService
          .getAllBetween(this.user, data.friendRequest.to)
          .subscribe();
      }
    );

    inbox.onMessage('sendInviteToHost', (invite: Invite) => {
      this.inviteService.receiveInvite(invite).subscribe();
    });

    inbox.onMessage('revokeInviteToHost', (invite: Invite) => {
      this.inviteService.removeInboundInvite(invite);
    });

    inbox.onMessage('rejectInviteToHost', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('acceptInviteToHost', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('removeFriend', (friend: Friend) => {
      this.friendService.removeFriend(friend);
      this.messageService.removeMessagesFromFriend(friend);
      this.inviteService.removeInvitesFromFriend(friend);
    });

    inbox.onError((code, message) =>
      console.log(
        `An error occurred with the inbox. Error Code: ${code} | Message: ${message}`
      )
    );
    return inbox;
  }

  setFriendInboxListeners(inbox: Room): Room {
    inbox.onMessage('messageUser', (message: Message) => {
      this.messageService.addMessageToFriend(message.from, message);
      this.friendService.reorderFriend(message.from._id, 'front');
    });

    inbox.onMessage('sendInviteToUser', (invite: Invite) => {
      this.inviteService.receiveInvite(invite).subscribe();
    });

    inbox.onMessage('revokeInviteToUser', (invite: Invite) => {
      this.inviteService.removeInboundInvite(invite);
    });

    inbox.onMessage('rejectInviteToUser', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('acceptInviteToUser', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('status', (friend: { id: string; status: Status }) => {
      this.friendService.updateFriendStatus(friend.id, friend.status);
    });

    inbox.onMessage(
      'hostIsTyping',
      (data: { friendId: string; isTyping: boolean }) => {
        this.friendService.setFriendIsTyping(data.friendId, data.isTyping);
      }
    );

    inbox.onMessage('disconnectFriend', (disconnectedFriend: Friend) => {
      this.friendService.removeFriend(disconnectedFriend);
      this.inboxService.removeConnectedInboxById(disconnectedFriend._id);
      this.messageService.removeMessagesFromFriend(disconnectedFriend);
      this.inviteService.removeInvitesFromFriend(disconnectedFriend);
    });

    inbox.onMessage('dispose', (inboxId: string) => {
      this.friendService.updateFriendStatus(inboxId, { presence: 'Offline' });
      this.inboxService.removeConnectedInboxById(inboxId);
    });
    inbox.onError((code, message) =>
      console.log(
        `An error occurred with the inbox. Error Code: ${code} | Message: ${message}`
      )
    );
    return inbox;
  }
}
