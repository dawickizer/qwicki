import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FriendService } from 'src/app/state/friend/friend.service';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';

@Component({
  selector: 'app-social-friends-list',
  templateUrl: './social-friends-list.component.html',
  styleUrls: ['./social-friends-list.component.css'],
})
export class SocialFriendsListComponent {
  @Input() friends: MatTableDataSource<Friend>;
  @Input() unviewedMessages: Message[];

  friendsDisplayedColumns: string[] = ['username'];
  panelOpenState = true;

  constructor(private friendService: FriendService) {}

  dropFriend(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.friends.data, event.previousIndex, event.currentIndex);
    this.friends._updateChangeSubscription();
    this.friendService.setFriends(this.friends.data);
  }
}
