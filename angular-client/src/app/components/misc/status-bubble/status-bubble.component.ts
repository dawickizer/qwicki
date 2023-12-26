import { Component, Input } from '@angular/core';
import { Activity } from 'src/app/types/activity/activity.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { Presence } from 'src/app/types/presence/presence.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';

@Component({
  selector: 'app-status-bubble',
  templateUrl: './status-bubble.component.html',
  styleUrls: ['./status-bubble.component.css'],
})
export class StatusBubbleComponent {
  @Input() color = 'var(--purple)';
  @Input() presence: Presence;
  @Input() activity: Activity;
  @Input() gameType: GameType;
  @Input() queueType: QueueType;
  @Input() disableToolTip = false;

  get toolTipText(): string {
    const gameType = this.gameType;
    const queueType = this.queueType;
    return gameType && queueType
      ? `${gameType} - ${queueType}`
      : gameType ?? queueType ?? '';
  }
}
