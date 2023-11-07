import { Component, Input } from '@angular/core';
import { OnlineStatus } from 'src/app/models/online-status/online-status';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-online-status',
  templateUrl: './online-status.component.html',
  styleUrls: ['./online-status.component.css'],
})
export class OnlineStatusComponent {
  @Input() status: OnlineStatus;
  @Input() readOnly = true;
  @Input() size = 10;

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

  updateStatus() {
    if (this.readOnly) return;
    switch (this.status) {
      case 'online':
        this.status = 'away';
        break;
      case 'away':
        this.status = 'offline';
        break;
      case 'offline':
        this.status = 'online';
        break;
      default:
        this.status = 'online';
    }
    this.socialOrchestratorService.setUserOnlineStatus(this.status).subscribe();
  }
}
