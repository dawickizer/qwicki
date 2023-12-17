import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/state/auth/auth.service';
import { DecodedJwt } from 'src/app/state/auth/decoded-jwt.model';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { Member } from 'src/app/state/lobby/member.model';
import { Observable } from 'rxjs';
import { LobbyService } from 'src/app/state/lobby/lobby.service';

@Component({
  selector: 'app-lobby-panel',
  templateUrl: './lobby-panel.component.html',
  styleUrls: ['./lobby-panel.component.css'],
})
export class LobbyPanelComponent implements OnInit {
  @Input() member: Member;
  decodedJwt$: Observable<DecodedJwt>;
  host$: Observable<Member>;

  constructor(
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private authService: AuthService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit() {
    this.decodedJwt$ = this.authService.decodedJwt$;
    this.host$ = this.lobbyService.host$;
  }

  kickMember(member: Member) {
    this.lobbyOrchestratorService.kickMember(member).subscribe();
  }

  transferHost(member: Member) {
    this.lobbyOrchestratorService.transferHost(member).subscribe();
  }

  leaveLobby() {
    this.lobbyOrchestratorService.leaveLobby().subscribe();
  }
}
