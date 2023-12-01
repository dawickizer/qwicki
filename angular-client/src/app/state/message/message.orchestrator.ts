import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { InboxService } from '../inbox/inbox.service';
import { Friend } from '../friend/friend.model';
import { Room } from 'colyseus.js';
import { Message } from '../message/message.model';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root',
})
export class MessageOrchestratorService {
  private user: User;
  private friendsInboxes: Room<any>[];
  private personalInbox: Room<any>;

  constructor(
    private userService: UserService,
    private inboxService: InboxService,
    private messageService: MessageService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.userService.user$.subscribe(user => (this.user = user));
    this.inboxService.friendsInboxes$.subscribe(
      friendsInboxes => (this.friendsInboxes = friendsInboxes)
    );
    this.inboxService.personalInbox$.subscribe(
      personalInbox => (this.personalInbox = personalInbox)
    );
  }

  setInitialState() {
    this.messageService.setInitialState();
  }

  getAllMessagesBetween(friend: Friend): Observable<Map<string, Message[]>> {
    return this.messageService.getAllBetween(this.user, friend);
  }

  sendMessage(friend: Friend, message: Message): Observable<Message> {
    return this.messageService.send(this.user, friend, message).pipe(
      tap(message => {
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === message.to._id
        );

        if (friendsInbox) {
          friendsInbox.send('messageHost', message);
        } else {
          this.personalInbox.send('messageUser', message);
        }
      })
    );
  }

  notifyFriendUserIsTyping(friend: Friend, isTyping: boolean): Observable<any> {
    return new Observable(subscriber => {
      const friendsInbox = this.friendsInboxes.find(
        friendsInbox => friendsInbox.id === friend._id
      );

      if (friendsInbox) {
        friendsInbox.send('userIsTyping', {
          friendId: this.user._id,
          isTyping,
        });
        subscriber.next({ success: true });
        subscriber.complete();
      } else {
        this.personalInbox.send('hostIsTyping', {
          friendId: friend._id,
          isTyping,
        });
        subscriber.next({ success: true });
        subscriber.complete();
      }
    });
  }

  markMessagesAsViewed(
    friend: Friend,
    messages: Message[]
  ): Observable<Message[]> {
    return this.messageService.markAsViewed(this.user, friend, messages);
  }
}
