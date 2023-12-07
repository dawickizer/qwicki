import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, map, startWith } from 'rxjs';
import { Friend } from 'src/app/state/friend/friend.model';

@Component({
  selector: 'app-invite-friend-menu',
  templateUrl: './invite-friend-menu.component.html',
  styleUrls: ['./invite-friend-menu.component.css'],
})
export class InviteFriendMenuComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  @Input() toolTipText: string | null = 'Invite Friend';

  friendSearchCtrl = new FormControl();
  filteredFriends: Observable<string[]>;
  allFriends: string[] = [
    'Friend 1',
    'Friend 2',
    'Friend 3',
    'Friend 1',
    'Friend 2',
    'Friend 3',
    'Friend 1',
    'Friend 2',
    'Friend 3',
    'Friend 1',
    'Friend 2',
    'Friend 3',
  ];

  ngOnInit() {
    this.filteredFriends = this.friendSearchCtrl.valueChanges.pipe(
      startWith(''),
      map(friend =>
        friend ? this._filterFriends(friend) : this.allFriends.slice()
      )
    );
  }

  // this can be used by parent components if they need to trigger the opening of the menu from themself instead of relying on the child component
  openMenu() {
    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }

  invite(friend: Friend | string) {
    console.log(friend);
  }

  onMenuOpened() {
    // Focus the input field after a slight delay to ensure it's rendered
    setTimeout(() => this.searchInput.nativeElement.focus(), 100);
  }

  onMenuClosed() {
    this.friendSearchCtrl.reset();
  }

  private _filterFriends(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFriends.filter(friend =>
      friend.toLowerCase().includes(filterValue)
    );
  }
}
