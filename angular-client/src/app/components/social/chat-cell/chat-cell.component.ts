import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';
import { MessageService } from 'src/app/state/message/message.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageOrchestratorService } from 'src/app/state/message/message.orchestrator';
import { FriendOrchestratorService } from 'src/app/state/friend/friend.orchestrator.service';
import { InviteOrchestratorService } from 'src/app/state/invite/invite.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { GameService } from 'src/app/state/game/game.service';
import { Invite } from 'src/app/state/invite/invite.model';

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
  gameId: string;
  lobbyId: string;
  unsubscribe$ = new Subject<void>();

  constructor(
    private friendOrchestratorService: FriendOrchestratorService,
    private inviteOrchestratorService: InviteOrchestratorService,
    private messageOrchestratorService: MessageOrchestratorService,
    private messageService: MessageService,
    private lobbyService: LobbyService,
    private gameService: GameService
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

    this.lobbyService.id$.pipe(takeUntil(this.unsubscribe$)).subscribe(id => {
      this.lobbyId = id;
    });

    this.gameService.id$.pipe(takeUntil(this.unsubscribe$)).subscribe(id => {
      this.gameId = id;
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
    let invite: Invite;
    if (this.gameId) {
      invite = new Invite({ type: 'game', roomId: this.gameId });
    } else if (this.lobbyId) {
      invite = new Invite({ type: 'party', roomId: this.lobbyId });
    }

    this.inviteOrchestratorService.sendInvite(this.friend, invite).subscribe();
  }
}
