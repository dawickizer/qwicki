import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { InboxService } from '../inbox/inbox.service';
import { Friend } from '../friend/friend.model';
import { Room } from 'colyseus.js';
import { InviteService } from '../invite/invite.service';
import { Invite } from '../invite/invite.model';

@Injectable({
  providedIn: 'root',
})
export class InviteOrchestratorService {
  private user: User;
  private friendsInboxes: Room<any>[];
  private personalInbox: Room<any>;

  constructor(
    private userService: UserService,
    private inboxService: InboxService,
    private inviteService: InviteService
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
    this.inviteService.setInitialState();
  }

  sendInvite(friend: Friend): Observable<Invite> {
    const invite = new Invite();
    invite.to = friend;
    invite.type = 'party';
    invite.roomId = '123';
    invite.metadata = 'Domination';

    return this.inviteService.sendInvite(this.user, invite).pipe(
      tap(invite => {
        if (invite) {
          const friendsInbox = this.friendsInboxes.find(
            friendsInbox => friendsInbox.id === invite.to._id
          );
          if (friendsInbox) {
            friendsInbox.send('sendInviteToHost', invite);
          } else {
            this.personalInbox.send('sendInviteToUser', invite);
          }
        }
      })
    );
  }

  revokeInvite(invite: Invite): Observable<Invite> {
    return this.inviteService.revokeInvite(this.user, invite).pipe(
      tap(async invite => {
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === invite.to._id
        );
        if (friendsInbox) {
          friendsInbox.send('revokeInviteToHost', invite);
        } else {
          this.personalInbox.send('revokeInviteToUser', invite);
        }
      })
    );
  }

  rejectInvite(invite: Invite): Observable<Invite> {
    return this.inviteService.rejectInvite(this.user, invite).pipe(
      tap(async invite => {
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === invite.from._id
        );

        if (friendsInbox) {
          friendsInbox.send('rejectInviteToHost', invite);
        } else {
          this.personalInbox.send('rejectInviteToUser', invite);
        }
      })
    );
  }

  acceptInvite(invite: Invite): Observable<Invite> {
    return this.inviteService.acceptInvite(this.user, invite).pipe(
      tap(async invite => {
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === invite.from._id
        );

        if (friendsInbox) {
          friendsInbox.send('acceptInviteToHost', invite);
        } else {
          this.personalInbox.send('acceptInviteToUser', invite);
        }
      })
    );
  }
}
