import { Component, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-social-friend-requests-list',
  templateUrl: './social-friend-requests-list.component.html',
  styleUrls: ['./social-friend-requests-list.component.css'],
})
export class SocialFriendRequestsListComponent implements OnDestroy {
  @Input() title: string;
  @Input() titleColor: string;

  @Input() friendRequests: MatTableDataSource<FriendRequest>;
  friendRequestsDisplayedColumns: string[] = ['username', 'action'];

  potentialFriend: string;

  unsubscribe$ = new Subject<void>();

  constructor(private socialOrchestratorService: SocialOrchestratorService) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isInboundFriendRequestsComponent(): boolean {
    return this.title === 'friend requests';
  }

  sendFriendRequest() {
    this.socialOrchestratorService
      .sendFriendRequest(this.potentialFriend)
      .subscribe();
    this.potentialFriend = '';
  }

  addNewFriend(friendRequest: FriendRequest) {
    this.socialOrchestratorService.addNewFriend(friendRequest).subscribe();
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService
      .rejectFriendRequest(friendRequest)
      .subscribe();
  }

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.socialOrchestratorService
      .revokeFriendRequest(friendRequest)
      .subscribe();
  }
}
