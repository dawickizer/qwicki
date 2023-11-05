import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.css'],
})
export class NotificationBadgeComponent {
  @Input() count = 0;
}
