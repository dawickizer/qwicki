import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Friend } from 'src/app/state/friend/friend.model';
import { FriendService } from 'src/app/state/friend/friend.service';
import { Invite } from 'src/app/state/invite/invite.model';
import { InviteOrchestratorService } from 'src/app/state/invite/invite.orchestrator.service';

@Component({
  selector: 'app-invite-friend-menu',
  templateUrl: './invite-friend-menu.component.html',
  styleUrls: ['./invite-friend-menu.component.css'],
})
export class InviteFriendMenuComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  @Input() toolTipText: string | null = 'Invite Friend';

  @Input() invite: Invite;

  friendSearchCtrl = new FormControl();
  filteredFriends$: Observable<Friend[]>;

  constructor(
    private friendService: FriendService,
    private inviteOrchestatorService: InviteOrchestratorService
  ) {}

  ngOnInit() {
    this.filteredFriends$ = combineLatest([
      this.friendService.friends$,
      this.friendSearchCtrl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([friends, search]) =>
        search ? this._filterFriends(friends, search) : friends
      )
    );
  }

  // this can be used by parent components if they need to trigger the opening of the menu from themself instead of relying on the child component
  openMenu() {
    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }

  sendInvite(friend: Friend) {
    this.inviteOrchestatorService.sendInvite(friend, this.invite).subscribe();
  }

  onMenuOpened() {
    // Focus the input field after a slight delay to ensure it's rendered
    setTimeout(() => this.searchInput.nativeElement.focus(), 100);
  }

  onMenuClosed() {
    this.friendSearchCtrl.reset();
  }

  private _filterFriends(friends: Friend[], value: string): Friend[] {
    const filterValue = value.toLowerCase();
    return friends.filter(
      friend => friend.username?.toLowerCase().includes(filterValue)
    );
  }
}
