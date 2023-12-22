import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/state/auth/auth.service';
import { DecodedJwt } from 'src/app/state/auth/decoded-jwt.model';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { Member } from 'src/app/state/lobby/member.model';
import { Observable, map } from 'rxjs';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { Friend } from 'src/app/state/friend/friend.model';
import { FriendService } from 'src/app/state/friend/friend.service';
import { FriendRequestOrchestratorService } from 'src/app/state/friend-request/friend-request.orchestrator.service';

@Component({
  selector: 'app-lobby-panel',
  templateUrl: './lobby-panel.component.html',
  styleUrls: ['./lobby-panel.component.css'],
})
export class LobbyPanelComponent implements OnInit {
  @Input() member: Member;
  friends$: Observable<Friend[]>;
  decodedJwt$: Observable<DecodedJwt>;
  host$: Observable<Member>;
  isReady$: Observable<boolean>;

  constructor(
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private friendRequestOrchestratorService: FriendRequestOrchestratorService,
    private friendService: FriendService,
    private authService: AuthService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit() {
    this.friends$ = this.friendService.friends$;
    this.decodedJwt$ = this.authService.decodedJwt$;
    this.host$ = this.lobbyService.host$;
    this.isReady$ = this.lobbyService.isReadyByMemberSessionId$(
      this.member?.sessionId
    );
  }

  kickMember(member: Member) {
    this.lobbyOrchestratorService.kickMember(member).subscribe();
  }

  transferHost(member: Member) {
    this.lobbyOrchestratorService.transferHost(member).subscribe();
  }

  leaveLobby() {
    this.lobbyOrchestratorService.leaveLobby().subscribe();
  }

  isFriend(member: Member): Observable<boolean> {
    return this.friends$.pipe(
      map(friends => friends.some(friend => friend._id === member._id))
    );
  }

  sendFriendRequest(member: Member) {
    this.friendRequestOrchestratorService
      .sendFriendRequest(member.username)
      .subscribe();
  }

  onReadyChange(member: Member) {
    this.lobbyOrchestratorService.toggleReady(member).subscribe();
  }
}
