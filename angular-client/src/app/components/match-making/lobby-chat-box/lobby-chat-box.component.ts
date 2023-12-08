import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'src/app/state/message/message.model';
import { Friend } from 'src/app/state/friend/friend.model';

@Component({
  selector: 'app-lobby-chat-box',
  templateUrl: './lobby-chat-box.component.html',
  styleUrls: ['./lobby-chat-box.component.css'],
})
export class LobbyChatBoxComponent {
  @ViewChild('scrollable') scrollable: ElementRef;

  messages: Message[] = [];
  newMessage = '';

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
      message.from = new Friend({ username: 'MintOwl' }); // remove this as backend will take care of it
      message.createdAt = new Date(); // remove this as backend will take care of it
      this.messages.push(message);
      this.newMessage = '';
      this.setScrollHeight(); // remove this later and make it happen on message update (like if other users send messages)
    }
  }
}
