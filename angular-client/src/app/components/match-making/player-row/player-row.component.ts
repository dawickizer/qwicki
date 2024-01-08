import { Component, Input } from '@angular/core';
import { Player } from 'src/app/state/game/player.model';

@Component({
  selector: 'app-player-row',
  templateUrl: './player-row.component.html',
  styleUrls: ['./player-row.component.css'],
})
export class PlayerRowComponent {
  @Input() player: Player;
}
