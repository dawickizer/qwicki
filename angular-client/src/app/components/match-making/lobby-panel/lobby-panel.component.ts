import { Component, Input } from '@angular/core';
import { Member } from 'src/app/state/lobby/member.model';

@Component({
  selector: 'app-lobby-panel',
  templateUrl: './lobby-panel.component.html',
  styleUrls: ['./lobby-panel.component.css'],
})
export class LobbyPanelComponent {
  @Input() member: Member;

  kick(member: Member) {
    console.log(member);
    this.member = null;
  }
}
