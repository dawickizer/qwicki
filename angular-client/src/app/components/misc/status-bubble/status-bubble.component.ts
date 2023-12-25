import { Component, Input } from '@angular/core';
import { Presence } from 'src/app/types/presence/presence.type';
import { Status } from 'src/app/models/status/status.model';

@Component({
  selector: 'app-status-bubble',
  templateUrl: './status-bubble.component.html',
  styleUrls: ['./status-bubble.component.css'],
})
export class StatusBubbleComponent {
  @Input() color = 'var(--purple)';
  @Input() presence: Presence;
  @Input() status: Status;
  @Input() disableToolTip = false;

  get toolTipText(): string {
    const gameType = this.status?.gameType;
    const queueType = this.status?.queueType;
    return gameType && queueType
      ? `${gameType} - ${queueType}`
      : gameType ?? queueType ?? '';
  }
}
