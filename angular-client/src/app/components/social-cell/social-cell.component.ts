import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-social-cell',
  templateUrl: './social-cell.component.html',
  styleUrls: ['./social-cell.component.css']
})
export class SocialCellComponent implements OnInit {

  @Input() host: User;
  @Input() friend: User;

  panelOpenState: boolean = false;

  constructor() {}

  ngOnInit(): void {}

}
