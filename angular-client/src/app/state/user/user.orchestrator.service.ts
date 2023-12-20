import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { InboxService } from '../inbox/inbox.service';
import { Room } from 'colyseus.js';
import { InactivityService } from '../inactivity/inactivity.service';
import { Presence } from 'src/app/models/presence/presence';

@Injectable({
  providedIn: 'root',
})
export class UserOrchestratorService {
  private user: User;
  private friendsInboxes: Room<any>[];
  private personalInbox: Room<any>;

  constructor(
    private userService: UserService,
    private inboxService: InboxService,
    private inactivityService: InactivityService
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

    // There is a potential race condition here but the way my logic is coded its not happening. If the inactivity presence ever gets updaetd before the user does...there could be a scenario where the updateUserStatus doesnt fire off
    this.inactivityService.presence$.subscribe(presence => {
      if (
        !this.user ||
        (this.user.presence === 'Offline' && presence === 'Away')
      )
        return;
      this.updatePresence(presence).subscribe();
    });
  }

  updatePresence(presence: Presence): Observable<Presence> {
    return new Observable(subscriber => {
      this.personalInbox.send('updateHostPresence', presence);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostPresence', {
          id: this.user._id,
          presence,
        });
      });
      this.userService.updatePresence(presence);
      subscriber.next(presence);
      subscriber.complete();
    });
  }
}
