import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member/member';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { UserOrchestratorService } from 'src/app/state/user/user.orchestrator.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  panels: { member: Member | null }[] = [];

  members: Map<string, Member>;

  constructor(
    private userOrchestratorService: UserOrchestratorService,
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit(): void {
    this.userOrchestratorService
      .updateStatus({ activity: 'In Lobby' })
      .subscribe();

    // need to figure out how to only do this once and not every time the component inits..perhaps sonmehow use lobby$
    this.lobbyOrchestratorService.createLobby().subscribe();
    this.lobbyService.members$.subscribe(members => {
      console.log(members);
      this.updatePanels(members);
    });
  }

  updatePanels(members: Map<string, Member> | null | undefined) {
    // Initialize panels with null values
    this.panels = Array.from({ length: 5 }, () => ({ member: null }));

    // If members is falsy, return early with empty panels
    if (!members) return;

    const memberArray = Array.from(members.values());
    const host = memberArray.find(member => member.isHost);

    // Place host in the center panel
    this.panels[2] = { member: host ?? null };

    // Define the order for non-host members
    const populateOrder = [1, 3, 0, 4];
    const nonHosts = memberArray.filter(member => !member.isHost);

    // Populate non-host members based on the defined order
    for (
      let i = 0, j = 0;
      i < nonHosts.length && j < populateOrder.length;
      i++, j++
    ) {
      this.panels[populateOrder[j]] = { member: nonHosts[i] };
    }
  }

  start() {
    console.log('start');
  }
}
