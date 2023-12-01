import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { InboxService } from '../inbox/inbox.service';
import { Room } from 'colyseus.js';
import { InactivityService } from '../inactivity/inactivity.service';
import { Status } from 'src/app/models/status/status.model';

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
        (this.user.status.presence === 'Offline' && presence === 'Away')
      )
        return;
      this.updateUserStatus({ presence }).subscribe();
    });
  }

  setInitialState() {
    this.userService.setInitialState();
  }

  updateUserStatus(status: Partial<Status>): Observable<Status> {
    return new Observable(subscriber => {
      this.personalInbox.send('updateHostStatus', status);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostStatus', {
          id: this.user._id,
          status,
        });
      });
      this.userService.updateStatus(status);
      subscriber.next(status as Status);
      subscriber.complete();
    });
  }
}
