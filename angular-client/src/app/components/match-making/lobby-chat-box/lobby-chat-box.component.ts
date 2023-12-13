import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { LobbyMessage } from 'src/app/state/lobby/lobby-message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby-chat-box',
  templateUrl: './lobby-chat-box.component.html',
  styleUrls: ['./lobby-chat-box.component.css'],
})
export class LobbyChatBoxComponent implements OnInit, OnDestroy {
  @ViewChild('scrollable') scrollable: ElementRef;

  messages: LobbyMessage[] = [];
  newMessage = '';
  messagesSubscription: Subscription;

  constructor(
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit() {
    this.messagesSubscription = this.lobbyService.messages$.subscribe(
      messages => {
        this.messages = messages;
        this.setScrollHeight();
      }
    );
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
  }

  setScrollHeight() {
    // wait 10ms to allow elementrefs to refresh..else the scroll height will be wrong
    setTimeout(
      () =>
        (this.scrollable.nativeElement.scrollTop =
          this.scrollable.nativeElement.scrollHeight),
      10
    );
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.lobbyOrchestratorService
        .sendMessage(new LobbyMessage({ content: this.newMessage }))
        .subscribe();
      this.newMessage = '';
    }
  }
}
