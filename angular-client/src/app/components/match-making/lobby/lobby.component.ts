import { Component, OnInit } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';
import { UserOrchestratorService } from 'src/app/state/user/user.orchestrator.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  panels = [
    { friend: null, color: 'none' },
    { friend: new Friend({ username: 'Senjoku' }), color: 'none' },
    { friend: new Friend({ username: 'MintOwl' }), color: 'none' },
    { friend: null, color: 'none' },
    { friend: null, color: 'none' },
  ];

  constructor(private userOrchestratorService: UserOrchestratorService) {}

  ngOnInit(): void {
    this.userOrchestratorService.updateStatus({ activity: 'In Lobby' });
  }

  simulateFriendJoin() {
    // change detection fires off if you update the internal object...we dont want that unless its for a null slot becoming an actual user
    setTimeout(() => {
      this.panels = [
        this.panels[0],
        this.panels[1],
        this.panels[2],
        { friend: new Friend({ username: 'Arshmazing' }), color: 'none' },
        this.panels[4],
      ];
    }, 3000);
  }

  start() {
    console.log('start');
  }
}
