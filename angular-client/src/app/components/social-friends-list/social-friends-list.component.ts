import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FriendService } from 'src/app/state/friend/friend.service';
import { Friend } from 'src/app/state/friend/friend.model';
import { MessageService } from 'src/app/state/message/message.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-social-friends-list',
  templateUrl: './social-friends-list.component.html',
  styleUrls: ['./social-friends-list.component.css'],
})
export class SocialFriendsListComponent implements OnInit, OnDestroy {
  @Input() friends: MatTableDataSource<Friend>;

  friendsDisplayedColumns: string[] = ['username'];

  panelOpenState = true;
  unviewedMessagesCount = 0;
  unsubscribe$ = new Subject<void>();

  constructor(
    private friendService: FriendService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.subscribeToUnviewedMessages();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  subscribeToUnviewedMessages() {
    this.messageService.unviewedMessages$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(unviewedMessages => {
        this.unviewedMessagesCount = unviewedMessages.length;
      });
  }

  dropFriend(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.friends.data, event.previousIndex, event.currentIndex);
    this.friends._updateChangeSubscription();
    this.friendService.setFriends(this.friends.data);
  }
}
