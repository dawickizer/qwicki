import { Component } from '@angular/core';

@Component({
  selector: 'app-ranked-game-match-making',
  templateUrl: './ranked-game-match-making.component.html',
  styleUrls: ['./ranked-game-match-making.component.css'],
})
export class RankedGameMatchMakingComponent {
  activeTabIndex = 0;

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }
}
