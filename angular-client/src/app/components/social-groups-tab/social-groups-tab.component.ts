import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-social-groups-tab',
  templateUrl: './social-groups-tab.component.html',
  styleUrls: ['./social-groups-tab.component.css'],
})
export class SocialGroupsTabComponent implements OnInit {
  @Input() self: User;
  @Input() selfJWT: any;

  titleColor = 'color:aliceblue';

  group: { name: string } = { name: '' };

  friends$: Observable<User[]> = new Observable<User[]>();

  selectedFriends: User[] = [];

  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.friends$ = of(this.self.friends);
    this.isAsyncDataPresent = true;
  }

  createGroup() {
    console.log(this.selectedFriends);
  }

  disableGroupCreation() {
    return this.selectedFriends.length == 0 || !this.group.name;
  }
}
