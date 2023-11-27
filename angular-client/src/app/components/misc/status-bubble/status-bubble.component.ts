import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-bubble',
  templateUrl: './status-bubble.component.html',
  styleUrls: ['./status-bubble.component.css'],
})
export class StatusBubbleComponent {
  @Input() color = 'var(--purple)';
  @Input() toolTipText = '';
  @Input() statusText = '';
  @Input() disableToolTip = false;
}
