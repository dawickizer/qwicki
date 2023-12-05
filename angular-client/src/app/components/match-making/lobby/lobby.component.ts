import { Component } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent {
  tiles = [
    { text: 'One', color: 'lightblue' },
    { text: 'Two', color: 'lightgreen' },
    { text: 'Three', color: 'lightpink' },
    { text: 'Four', color: '#DDBDF1' },
    { text: 'Five', color: 'red' },
  ];

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      // Enter full-screen mode
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Failed to enter full-screen mode: ${e.message}`);
      });
    } else {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(e => {
          console.error(`Failed to exit full-screen mode: ${e.message}`);
        });
      }
    }
  }
}
