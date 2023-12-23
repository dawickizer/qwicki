import { Component } from '@angular/core';

@Component({
  selector: 'app-normal-game-match-making',
  templateUrl: './normal-game-match-making.component.html',
  styleUrls: ['./normal-game-match-making.component.css'],
})
export class NormalGameMatchMakingComponent {
  activeTabIndex = 0;

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }
}
