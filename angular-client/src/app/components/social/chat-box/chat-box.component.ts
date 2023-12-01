import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MessageOrchestratorService } from 'src/app/state/message/message.orchestrator';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent {
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
  isTyping = false;
  typing = new Subject<void>();

  constructor(private messageOrchestratorService: MessageOrchestratorService) {
    this.setupDebounce();
  }

  private setupDebounce(): void {
    this.typing = new Subject<void>();
    this.typing
      .pipe(
        debounceTime(2000) // Wait for 2 seconds of inactivity
      )
      .subscribe(() => {
        this.isTyping = false;
        this.messageOrchestratorService
          .notifyFriendUserIsTyping(this.friend, false)
          .subscribe();
      });
  }

  onKeyPress(): void {
    if (!this.isTyping) {
      this.isTyping = true;
      this.messageOrchestratorService
        .notifyFriendUserIsTyping(this.friend, true)
        .subscribe();
    }
    // Each keypress resets the debounce timer.
    this.typing.next();
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

  sendMessage(event?: any) {
    // Prevent that text area from causing an expand event
    if (event) event.preventDefault();
    if (this.newMessage.trim() !== '') {
      const message: Message = new Message();
      message.content = this.newMessage;
      message.to = this.friend;
      this.messageOrchestratorService
        .sendMessage(this.friend, message)
        .subscribe();

      // Immediately set isTyping to false and notify that the user has stopped typing
      this.isTyping = false;
      this.typing.complete(); // Complete the current subject
      this.messageOrchestratorService
        .notifyFriendUserIsTyping(this.friend, false)
        .subscribe();

      // Recreate the typing Subject for a new typing session
      this.typing = new Subject<void>();
      this.setupDebounce();

      // Reset the new message
      this.newMessage = '';
    }
  }

  keepOrder(a: { key: string; value: any }, b: { key: string; value: any }) {
    return new Date(a.key).getTime() - new Date(b.key).getTime();
  }
}
