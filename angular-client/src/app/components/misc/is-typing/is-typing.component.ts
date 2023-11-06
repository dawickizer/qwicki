import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-is-typing',
  templateUrl: './is-typing.component.html',
  styleUrls: ['./is-typing.component.css'],
})
export class IsTypingComponent {
  @Input() username: string;
}
