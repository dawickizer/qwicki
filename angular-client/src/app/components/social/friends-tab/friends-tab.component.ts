import { Component, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';
import { Notification } from 'src/app/models/notification/notification';
import { FriendRequestOrchestratorService } from 'src/app/state/friend-request/friend-request.orchestrator.service';

@Component({
  selector: 'app-friends-tab',
  templateUrl: './friends-tab.component.html',
  styleUrls: ['./friends-tab.component.css'],
})
export class FriendsTabComponent {
  @ViewChild('drawer') drawer: MatSidenav;
  friends = new MatTableDataSource<Friend>([] as Friend[]);

  outboundNotifications = new MatTableDataSource<Notification>([]);
  inboundNotifications = new MatTableDataSource<Notification>([]);

  @Input() unviewedMessages: Message[];

  @Input()
  set friendsData(data: Friend[]) {
    // merge results to preserve old mem addresses which will make it so angular doesn't re-render the entire list, which can be
    // disruptive if you are interacting with the list. Ensure that the online field is updated on the current object as well
    this.friends.data = data.map(friend => {
      const existingFriend = this.friends.data.find(f => f._id === friend._id);
      if (existingFriend) {
        // Check if onlineIndex or offlineIndex have changed
        if (existingFriend.status?.presence !== friend.status?.presence) {
          existingFriend.status.presence = friend.status?.presence;
        }
        if (existingFriend.status?.activity !== friend.status?.activity) {
          existingFriend.status.activity = friend.status?.activity;
        }
        if (existingFriend.status?.queueType !== friend.status?.queueType) {
          existingFriend.status.queueType = friend.status?.queueType;
        }
        if (existingFriend.status?.gameType !== friend.status?.gameType) {
          existingFriend.status.gameType = friend.status?.gameType;
        }
        if (existingFriend.isTyping !== friend.isTyping) {
          existingFriend.isTyping = friend.isTyping;
        }
        return existingFriend;
      } else {
        return friend;
      }
    });
  }

  @Input()
  set inboundNotificationsData(data: Notification[]) {
    this.inboundNotifications.data = [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  @Input()
  set outboundNotificationsData(data: Notification[]) {
    this.outboundNotifications.data = [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  displayedColumns: string[] = ['username'];

  potentialFriend = '';

  constructor(
    private friendRequestOrchestratorService: FriendRequestOrchestratorService
  ) {}

  filter() {
    this.friends.filterPredicate = (friend, filter) =>
      friend.username.trim().toLowerCase().includes(filter);
    this.friends.filter = this.potentialFriend.trim().toLowerCase();

    this.outboundNotifications.filterPredicate = (notification, filter) =>
      notification.to.username.trim().toLowerCase().includes(filter);
    this.outboundNotifications.filter = this.potentialFriend
      .trim()
      .toLowerCase();

    this.inboundNotifications.filterPredicate = (notification, filter) =>
      notification.from.username.trim().toLowerCase().includes(filter);
    this.inboundNotifications.filter = this.potentialFriend
      .trim()
      .toLowerCase();
  }

  sendFriendRequest() {
    this.friendRequestOrchestratorService
      .sendFriendRequest(this.potentialFriend)
      .subscribe();
    this.potentialFriend = '';
    this.friends.filter = '';
    this.inboundNotifications.filter = '';
    this.outboundNotifications.filter = '';
  }
}
