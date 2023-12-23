import { Component } from '@angular/core';

@Component({
  selector: 'app-money-match-game-match-making',
  templateUrl: './money-match-game-match-making.component.html',
  styleUrls: ['./money-match-game-match-making.component.css'],
})
export class MoneyMatchGameMatchMakingComponent {
  activeTabIndex = 0;

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }
}
