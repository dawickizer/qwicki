import { Component, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Friend } from 'src/app/state/friend/friend.model';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { Message } from 'src/app/state/message/message.model';

@Component({
  selector: 'app-friends-tab',
  templateUrl: './friends-tab.component.html',
  styleUrls: ['./friends-tab.component.css'],
})
export class FriendsTabComponent {
  @ViewChild('drawer') drawer: MatSidenav;
  friends = new MatTableDataSource<Friend>([] as Friend[]);
  inboundFriendRequests = new MatTableDataSource<FriendRequest>(
    [] as FriendRequest[]
  );
  outboundFriendRequests = new MatTableDataSource<FriendRequest>(
    [] as FriendRequest[]
  );

  @Input() unviewedMessages: Message[];

  @Input()
  set friendsData(data: Friend[]) {
    // merge results to preserve old mem addresses which will make it so angular doesn't re-render the entire list, which can be
    // disruptive if you are interacting with the list. Ensure that the online field is updated on the current object as well
    this.friends.data = data.map(friend => {
      const existingFriend = this.friends.data.find(f => f._id === friend._id);
      if (existingFriend) {
        // Check if onlineIndex or offlineIndex have changed
        if (existingFriend.onlineStatus !== friend.onlineStatus) {
          existingFriend.onlineStatus = friend.onlineStatus;
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
  set inboundFriendRequestsData(data: FriendRequest[]) {
    this.inboundFriendRequests.data = data;
  }

  @Input()
  set outboundFriendRequestsData(data: FriendRequest[]) {
    this.outboundFriendRequests.data = data;
  }

  displayedColumns: string[] = ['username'];

  filter(filterValue: any) {
    this.friends.filterPredicate = (friend, filter) =>
      friend.username.trim().toLowerCase().includes(filter);
    this.friends.filter = filterValue.target.value.trim().toLowerCase();

    this.inboundFriendRequests.filterPredicate = (friendRequest, filter) =>
      friendRequest.from.username.trim().toLowerCase().includes(filter);
    this.inboundFriendRequests.filter = filterValue.target.value
      .trim()
      .toLowerCase();

    this.outboundFriendRequests.filterPredicate = (friendRequest, filter) =>
      friendRequest.to.username.trim().toLowerCase().includes(filter);
    this.outboundFriendRequests.filter = filterValue.target.value
      .trim()
      .toLowerCase();
  }
}
