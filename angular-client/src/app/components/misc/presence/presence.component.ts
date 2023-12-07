import { Component, Input } from '@angular/core';
import { Presence } from 'src/app/models/status/status.model';
import { UserOrchestratorService } from 'src/app/state/user/user.orchestrator.service';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css'],
})
export class PresenceComponent {
  @Input() presence: Presence;
  @Input() readOnly = true;
  @Input() size = 10;

  constructor(private userOrchestratorService: UserOrchestratorService) {}

  updatePresence() {
    if (this.readOnly) return;
    switch (this.presence) {
      case 'Online':
        this.presence = 'Away';
        break;
      case 'Away':
        this.presence = 'Offline';
        break;
      case 'Offline':
        this.presence = 'Online';
        break;
      default:
        this.presence = 'Online';
    }
    this.userOrchestratorService
      .updateStatus({ presence: this.presence })
      .subscribe();
  }
}
