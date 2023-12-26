import { Component, OnInit, OnDestroy } from '@angular/core';
import { Member } from 'src/app/state/lobby/member.model';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { Observable, Subscription } from 'rxjs';
import { DecodedJwt } from 'src/app/state/auth/decoded-jwt.model';
import { AuthService } from 'src/app/state/auth/auth.service';
import { GameType } from 'src/app/types/game-type/game-type.type';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  panels: { member: Member | null; hideIsReady?: boolean }[] = [];
  startButtonText = 'Start';
  membersSubscription: Subscription;
  gameType: GameType;
  gameTypeSubscription: Subscription;
  decodedJwt$: Observable<DecodedJwt>;
  host$: Observable<Member>;
  isReady$: Observable<boolean>;
  constructor(
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private authService: AuthService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit(): void {
    this.lobbyOrchestratorService.createLobby().subscribe();
    this.membersSubscription = this.lobbyService.members$.subscribe(members =>
      this.updatePanels(members)
    );
    this.gameTypeSubscription = this.lobbyService.gameType$.subscribe(
      gameType => {
        this.gameType = gameType;
        this.determineStartButtonText();
      }
    );
    this.decodedJwt$ = this.authService.decodedJwt$;
    this.host$ = this.lobbyService.host$;
    this.isReady$ = this.lobbyService.isReady$;
  }

  ngOnDestroy() {
    this.membersSubscription?.unsubscribe();
    this.gameTypeSubscription?.unsubscribe();
  }

  determineStartButtonText() {
    if (!this.gameType) this.startButtonText = 'Start';
    if (this.gameType === 'Normal') this.startButtonText = 'Find Game';
    if (this.gameType === 'Ranked') this.startButtonText = 'Find Game';
    if (this.gameType === 'Custom') this.startButtonText = 'Create/Join Game';
    if (this.gameType === 'Money Match')
      this.startButtonText = 'Create/Join Game';
  }

  updatePanels(members: Map<string, Member> | null | undefined) {
    if (!members) {
      this.panels = Array.from({ length: 5 }, () => ({ member: null }));
      return;
    }

    // Initialize panels if they haven't been initialized yet
    if (this.panels.length === 0) {
      this.panels = Array.from({ length: 5 }, () => ({ member: null }));
    }

    const memberArray = Array.from(members.values());
    const host = memberArray.find(member => member.isHost);

    // Update the host in the center panel
    this.updateHostPanel(host, members);

    // Define the order for non-host members
    const populateOrder = [1, 3, 0, 4];
    const nonHosts = memberArray.filter(member => !member.isHost);

    // Populate or update non-host members based on the defined order
    this.updateNonHostPanels(nonHosts, populateOrder);
  }

  updateHostPanel(
    host: Member | undefined,
    members: Map<string, Member> | null | undefined
  ) {
    const hostPanel = this.panels[2];
    if (hostPanel.member && hostPanel.member._id === host?._id) {
      this.panels[2].hideIsReady = members?.size <= 1;
      return;
    }
    this.panels[2] = { member: host ?? null, hideIsReady: members?.size <= 1 };
  }

  // just note that this logic will prevent the lobby-panel from rerendering...thus the @Input member prop will remain
  // stale if it deviates from state. This was done to prevent the animations of the panel from playing if the member
  // was not affected by any joins/leaves. This logic could maybe be revisited but for now its working. Inside the
  // lobby-panel I am using state like isReady instead of member.isReady to get around this
  updateNonHostPanels(nonHosts: Member[], populateOrder: number[]) {
    populateOrder.forEach((position, index) => {
      const existingMember = this.panels[position].member;
      if (index >= nonHosts.length) {
        if (existingMember) this.panels[position] = { member: null };
        return;
      }

      const newMember = nonHosts[index];
      if (!existingMember || existingMember._id !== newMember._id) {
        this.panels[position] = { member: newMember };
      }
    });
  }

  start() {
    if (this.gameType === 'Custom')
      this.lobbyOrchestratorService.setActivity('In Pregame Lobby').subscribe();
  }

  isHost(): boolean {
    return this.lobbyOrchestratorService.isHost();
  }
}
