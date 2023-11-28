import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-bubble',
  templateUrl: './info-bubble.component.html',
  styleUrls: ['./info-bubble.component.css'],
})
export class InfoBubbleComponent {
  @Input() color = 'var(--purple)';
  @Input() toolTipText = '';
  @Input() infoText = '';
  @Input() disableToolTip = false;
}
