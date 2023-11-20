import { Component, OnInit } from '@angular/core';
import { Subject, Observable, combineLatest, map } from 'rxjs';
import { UserService } from 'src/app/state/user/user.service';
import { User } from 'src/app/state/user/user.model';
import { MessageService } from 'src/app/state/message/message.service';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { FriendRequestService } from 'src/app/state/friend-request/friend-request.service';
import { Friend } from 'src/app/state/friend/friend.model';
import { FriendService } from 'src/app/state/friend/friend.service';
import { Message } from 'src/app/state/message/message.model';
import { Invite } from 'src/app/state/invite/invite.model';
import { InviteService } from 'src/app/state/invite/invite.service';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css'],
})
export class SocialSidenavComponent implements OnInit {
  activeTabIndex = 0;
  combinedNotifications$: Observable<{ count: number; hasData: boolean }>;
  user$: Observable<User>;
  friends$: Observable<Friend[]>;
  outboundFriendRequests$: Observable<FriendRequest[]>;
  inboundFriendRequests$: Observable<FriendRequest[]>;
  outboundInvites$: Observable<Invite[]>;
  inboundInvites$: Observable<Invite[]>;
  unviewedMessages$: Observable<Message[]>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private friendService: FriendService,
    private friendRequestService: FriendRequestService,
    private inviteService: InviteService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.friends$ = this.friendService.friends$;
    this.inboundFriendRequests$ =
      this.friendRequestService.inboundFriendRequests$;
    this.outboundFriendRequests$ =
      this.friendRequestService.outboundFriendRequests$;
    this.inboundInvites$ = this.inviteService.inboundInvites$;
    this.outboundInvites$ = this.inviteService.outboundInvites$;
    this.unviewedMessages$ = this.messageService.unviewedMessages$;
    this.combinedNotifications$ = combineLatest([
      this.unviewedMessages$,
      this.inboundFriendRequests$,
      this.inboundInvites$,
    ]).pipe(
      map(([unviewedMessages, inboundFriendRequests, inboundInvites]) => ({
        count:
          unviewedMessages.length +
          inboundFriendRequests.length +
          inboundInvites.length,
        hasData:
          unviewedMessages.length > 0 ||
          inboundFriendRequests.length > 0 ||
          inboundInvites.length > 0,
      }))
    );
  }

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }
}
