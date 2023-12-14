import { Component, Input } from '@angular/core';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { Member } from 'src/app/state/lobby/member.model';

@Component({
  selector: 'app-lobby-panel',
  templateUrl: './lobby-panel.component.html',
  styleUrls: ['./lobby-panel.component.css'],
})
export class LobbyPanelComponent {
  @Input() member: Member;

  constructor(private lobbyOrchestratorService: LobbyOrchestratorService) {}

  kickMember(member: Member) {
    this.lobbyOrchestratorService.kickMember(member).subscribe();
  }

  transferHost(member: Member) {
    this.lobbyOrchestratorService.transferHost(member).subscribe();
  }
}
