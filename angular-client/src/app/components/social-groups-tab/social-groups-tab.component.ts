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

  selectedFriend: User;

  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.friends$ = of(this.self.friends);
    this.isAsyncDataPresent = true;
  }

  createGroup() {
    console.log('create group');
  }

  disableGroupCreation() {
    return false;
  }

  onFriendsSelectionChange(friend: User) {
    console.log(friend);
  }
}
