import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-online-status',
  templateUrl: './online-status.component.html',
  styleUrls: ['./online-status.component.css'],
})
export class OnlineStatusComponent {
  @Input() status: 'online' | 'offline' | 'away';
  @Input() readOnly = true;
  @Input() size = 10;

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
  }
}
