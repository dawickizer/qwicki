import { Inbox } from '../rooms/Inbox';

export class InboxManager {
  inbox: Inbox;

  constructor(inbox: Inbox) {
    this.inbox = inbox;
    this.setOnMessageListeners();
  }

  setOnMessageListeners() {
    // implement listeners here if needed
  }
}
