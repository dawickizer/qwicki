import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/state/lobby/member.model';
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

    // TODO: need to figure out how to only do this once and not every time the component inits..perhaps sonmehow use lobby$
    this.lobbyOrchestratorService.createLobby().subscribe();

    // TODO: dont forget to manage this subscription and unsubscribe when component destroys
    this.lobbyService.members$.subscribe(members => {
      console.log(members);
      this.updatePanels(members);
    });
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
    this.updateHostPanel(host);

    // Define the order for non-host members
    const populateOrder = [1, 3, 0, 4];
    const nonHosts = memberArray.filter(member => !member.isHost);

    // Populate or update non-host members based on the defined order
    this.updateNonHostPanels(nonHosts, populateOrder);
  }

  updateHostPanel(host: Member | undefined) {
    const hostPanel = this.panels[2];
    if (hostPanel.member && hostPanel.member._id === host?._id) return;
    this.panels[2] = { member: host ?? null };
  }

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
    console.log('start');
  }
}
