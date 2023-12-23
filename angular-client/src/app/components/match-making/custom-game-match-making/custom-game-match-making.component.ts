import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-game-match-making',
  templateUrl: './custom-game-match-making.component.html',
  styleUrls: ['./custom-game-match-making.component.css'],
})
export class CustomGameMatchMakingComponent {
  activeTabIndex = 0;

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }
}
