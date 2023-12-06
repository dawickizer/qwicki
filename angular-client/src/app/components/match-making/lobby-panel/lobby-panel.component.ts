import { Component, Input } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';

@Component({
  selector: 'app-lobby-panel',
  templateUrl: './lobby-panel.component.html',
  styleUrls: ['./lobby-panel.component.css'],
})
export class LobbyPanelComponent {
  @Input() friend: Friend;

  invite() {
    console.log('INVITE');
  }

  kick(friend: Friend) {
    console.log(friend)
    this.friend = null;
  }
}
