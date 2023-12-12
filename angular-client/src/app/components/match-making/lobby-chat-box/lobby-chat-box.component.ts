import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { LobbyMessage } from 'src/app/state/lobby/lobby-message.model';

@Component({
  selector: 'app-lobby-chat-box',
  templateUrl: './lobby-chat-box.component.html',
  styleUrls: ['./lobby-chat-box.component.css'],
})
export class LobbyChatBoxComponent implements OnInit {
  @ViewChild('scrollable') scrollable: ElementRef;

  messages: LobbyMessage[] = [];
  newMessage = '';

  constructor(
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit() {
    // TODO: dont forget to manage this subscription
    this.lobbyService.messages$.subscribe(messages => {
      console.log(messages);
      this.messages = messages;
      this.setScrollHeight();
    });
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
