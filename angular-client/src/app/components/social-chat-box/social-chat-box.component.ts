import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-social-chat-box',
  templateUrl: './social-chat-box.component.html',
  styleUrls: ['./social-chat-box.component.css'],
})
export class SocialChatBoxComponent {
  @ViewChild('scrollable') scrollable: ElementRef;

  @Input() friend: Friend;

  private _panelOpenState: boolean;
  @Input() set panelOpenState(panelOpenState: boolean) {
    this._panelOpenState = panelOpenState;
    if (panelOpenState) this.setScrollHeight();
  }

  get panelOpenState(): boolean {
    return this._panelOpenState;
  }

  private _messages: Map<string, Message[]> = new Map();
  @Input() set messages(messages: Map<string, Message[]>) {
    this._messages = messages;
    this.setScrollHeight();
  }

  get messages(): Map<string, Message[]> {
    return this._messages;
  }

  newMessage = '';

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

  setScrollHeight() {
    // wait 10ms to allow elementrefs to refresh..else the scroll height will be wrong
    setTimeout(
      () =>
        (this.scrollable.nativeElement.scrollTop =
          this.scrollable.nativeElement.scrollHeight),
      10
    );
  }

  getParagraphs(message: Message) {
    const result = message?.content?.split('\n') ?? [];
    return result;
  }

  sendMessage(event?: any) {
    // // prevent that text area from causing an expand event
    if (event) event.preventDefault();
    if (this.newMessage && this.newMessage !== '') {
      const message: Message = new Message();
      message.content = this.newMessage;
      message.to = this.friend;
      this.socialOrchestratorService
        .sendMessage(this.friend, message)
        .subscribe();
      this.newMessage = '';
    }
  }

  removeFriend() {
    this.socialOrchestratorService.deleteFriend(this.friend).subscribe();
  }
}
