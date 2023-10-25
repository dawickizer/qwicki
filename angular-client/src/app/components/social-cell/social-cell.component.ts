import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';
import { MessageService } from 'src/app/state/message/message.service';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-social-cell',
  templateUrl: './social-cell.component.html',
  styleUrls: ['./social-cell.component.css'],
})
export class SocialCellComponent implements OnInit, OnDestroy {
  @Input() friend: Friend;

  panelOpenState = false;
  messages: Map<string, Message[]> = new Map();
  unviewedMessages: Message[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(
    private socialOrchestratorService: SocialOrchestratorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.socialOrchestratorService
      .getAllMessagesBetween(this.friend)
      .subscribe();

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
      this.socialOrchestratorService
        .markMessagesAsViewed(this.friend, this.unviewedMessages)
        .subscribe();
    }
  }
}
