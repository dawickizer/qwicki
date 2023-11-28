import { Component, Input } from '@angular/core';
import { Presence } from 'src/app/models/status/status.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css'],
})
export class PresenceComponent {
  @Input() presence: Presence;
  @Input() readOnly = true;
  @Input() size = 10;

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

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
    this.socialOrchestratorService
      .updateUserStatus({ presence: this.presence })
      .subscribe();
  }
}
