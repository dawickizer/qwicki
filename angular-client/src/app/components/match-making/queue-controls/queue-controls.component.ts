import { Component } from '@angular/core';
import { GameType, QueueType } from 'src/app/models/status/status.model';

@Component({
  selector: 'app-queue-controls',
  templateUrl: './queue-controls.component.html',
  styleUrls: ['./queue-controls.component.css'],
})
export class QueueControlsComponent {
  queueTypes: QueueType[] = ['Solo', 'Duo', 'Squad'];
  gameTypes: GameType[] = ['Normal', 'Ranked', 'Money Match', 'Custom'];
}
