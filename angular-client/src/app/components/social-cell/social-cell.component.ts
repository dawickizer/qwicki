import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-social-cell',
  templateUrl: './social-cell.component.html',
  styleUrls: ['./social-cell.component.css']
})
export class SocialCellComponent implements OnInit {

  @Input() host: User;
  @Input() friend: User;
  @Output() remove: EventEmitter<User> = new EventEmitter();

  panelOpenState: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  removeFriend() {
    this.remove.emit(this.friend);
  }

}
