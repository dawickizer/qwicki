import { Injectable } from '@angular/core';
import { FriendService } from '../friend/friend.service';
import { InboxService } from '../inbox/inbox.service';
import { Friend } from '../friend/friend.model';
import { Room } from 'colyseus.js';
import { Message } from '../message/message.model';
import { MessageService } from '../message/message.service';
import { InviteService } from '../invite/invite.service';
import { Invite } from '../invite/invite.model';
import { FriendRequest } from '../friend-request/friend-requests.model';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { Presence } from 'src/app/types/presence/presence.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

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

    inbox.onMessage(
      'activity',
      (friend: { id: string; activity: Activity }) => {
        this.friendService.setFriendActivity(friend.id, friend.activity);
      }
    );

    inbox.onMessage(
      'queueType',
      (friend: { id: string; queueType: QueueType }) => {
        this.friendService.setFriendQueueType(friend.id, friend.queueType);
      }
    );

    inbox.onMessage(
      'gameType',
      (friend: { id: string; gameType: GameType }) => {
        this.friendService.setFriendGameType(friend.id, friend.gameType);
      }
    );

    inbox.onMessage(
      'gameMode',
      (friend: { id: string; gameMode: GameMode }) => {
        this.friendService.setFriendGameMode(friend.id, friend.gameMode);
      }
    );

    inbox.onMessage('gameMap', (friend: { id: string; gameMap: GameMap }) => {
      this.friendService.setFriendGameMap(friend.id, friend.gameMap);
    });

    inbox.onMessage(
      'presence',
      (friend: { id: string; presence: Presence }) => {
        this.friendService.setFriendPresence(friend.id, friend.presence);
      }
    );

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
      (data: {
        friendRequest: FriendRequest;
        presence: Presence;
        activity: Activity;
        queueType: QueueType;
        gameType: GameType;
        gameMode: GameMode;
        gameMap: GameMap;
      }) => {
        this.friendRequestService.removeOutboundFriendRequest(
          data.friendRequest
        );
        this.friendService.addFriend(data.friendRequest.to);
        this.friendService.setFriendPresence(
          data.friendRequest.to._id,
          data.presence
        );
        this.friendService.setFriendActivity(
          data.friendRequest.to._id,
          data.activity
        );
        this.friendService.setFriendQueueType(
          data.friendRequest.to._id,
          data.queueType
        );
        this.friendService.setFriendGameType(
          data.friendRequest.to._id,
          data.gameType
        );
        this.friendService.setFriendGameMode(
          data.friendRequest.to._id,
          data.gameMode
        );
        this.friendService.setFriendGameMap(
          data.friendRequest.to._id,
          data.gameMap
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

    inbox.onMessage(
      'activity',
      (friend: { id: string; activity: Activity }) => {
        this.friendService.setFriendActivity(friend.id, friend.activity);
      }
    );

    inbox.onMessage(
      'queueType',
      (friend: { id: string; queueType: QueueType }) => {
        this.friendService.setFriendQueueType(friend.id, friend.queueType);
      }
    );

    inbox.onMessage(
      'gameType',
      (friend: { id: string; gameType: GameType }) => {
        this.friendService.setFriendGameType(friend.id, friend.gameType);
      }
    );

    inbox.onMessage(
      'gameMode',
      (friend: { id: string; gameMode: GameMode }) => {
        this.friendService.setFriendGameMode(friend.id, friend.gameMode);
      }
    );

    inbox.onMessage('gameMap', (friend: { id: string; gameMap: GameMap }) => {
      this.friendService.setFriendGameMap(friend.id, friend.gameMap);
    });

    inbox.onMessage(
      'presence',
      (friend: { id: string; presence: Presence }) => {
        this.friendService.setFriendPresence(friend.id, friend.presence);
      }
    );

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
      this.friendService.setFriendActivity(inboxId, null);
      this.friendService.setFriendQueueType(inboxId, null);
      this.friendService.setFriendGameType(inboxId, null);
      this.friendService.setFriendGameMode(inboxId, null);
      this.friendService.setFriendGameMap(inboxId, null);
      this.friendService.setFriendPresence(inboxId, 'Offline');
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
