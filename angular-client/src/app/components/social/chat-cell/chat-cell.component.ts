import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';
import { MessageService } from 'src/app/state/message/message.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageOrchestratorService } from 'src/app/state/message/message.orchestrator';
import { FriendOrchestratorService } from 'src/app/state/friend/friend.orchestrator.service';
import { InviteOrchestratorService } from 'src/app/state/invite/invite.orchestrator.service';

@Component({
  selector: 'app-chat-cell',
  templateUrl: './chat-cell.component.html',
  styleUrls: ['./chat-cell.component.css'],
})
export class ChatCellComponent implements OnInit, OnDestroy {
  @Input() friend: Friend;

  panelOpenState = false;
  messages: Map<string, Message[]> = new Map();
  unviewedMessages: Message[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(
    private friendOrchestratorService: FriendOrchestratorService,
    private inviteOrchestratorService: InviteOrchestratorService,
    private messageOrchestratorService: MessageOrchestratorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.messageService
      .messagesByFriendId$(this.friend._id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(messages => {
        if (messages) {
          this.messages = messages;
        }
      });

    this.messageService
      .unviewedMessagesByFriendId$(this.friend._id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(unviewedMessages => {
        if (unviewedMessages) {
          this.unviewedMessages = unviewedMessages;
          this.markMessagesAsViewed();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPanelOpen() {
    this.panelOpenState = true;
    this.markMessagesAsViewed();
  }

  onPanelClose() {
    this.panelOpenState = false;
  }

  markMessagesAsViewed() {
    if (this.panelOpenState && this.unviewedMessages.length > 0) {
      this.messageOrchestratorService
        .markMessagesAsViewed(this.friend, this.unviewedMessages)
        .subscribe();
    }
  }

  removeFriend() {
    this.friendOrchestratorService.deleteFriend(this.friend).subscribe();
  }

  sendInvite() {
    this.inviteOrchestratorService.sendInvite(this.friend).subscribe();
  }
}
