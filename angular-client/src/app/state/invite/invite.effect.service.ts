import { Injectable } from '@angular/core';
import { Observable, tap, of, catchError } from 'rxjs';
import { Invite } from './invite.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InviteApiService } from './invite.api.service';
import { User } from '../user/user.model';
import { InviteStateService } from './invite.state.service';

@Injectable({
  providedIn: 'root',
})
export class InviteEffectService {
  private receivedInviteAudio = new Audio(
    'assets/notifications/sounds/mixkit-magic-notification-ring-2344.wav'
  );

  constructor(
    private inviteApiService: InviteApiService,
    private inviteStateService: InviteStateService,
    private snackBar: MatSnackBar
  ) {}

  sendInvite(user: User, potentialFriend: string): Observable<Invite> {
    this.inviteStateService.setIsLoading(true);
    return this.inviteApiService.create(user, potentialFriend).pipe(
      tap(invite => {
        this.inviteStateService.addOutboundInvite(invite);
        this.inviteStateService.setIsLoading(false);
        this.snackBar.open(`Invite sent to ${potentialFriend}`, 'Dismiss', {
          duration: 5000,
        });
      }),
      catchError(this.handleError)
    );
  }

  revokeInvite(user: User, invite: Invite): Observable<Invite> {
    this.inviteStateService.setIsLoading(true);
    return this.inviteApiService.delete(user, invite._id).pipe(
      tap(async invite => {
        this.inviteStateService.removeOutboundInvite(invite);
        this.inviteStateService.setIsLoading(false);
        this.snackBar.open(
          `Invite unsent to ${invite.to.username}`,
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  rejectInvite(user: User, invite: Invite): Observable<Invite> {
    this.inviteStateService.setIsLoading(true);
    return this.inviteApiService.delete(user, invite._id).pipe(
      tap(async invite => {
        this.inviteStateService.removeInboundInvite(invite);
        this.inviteStateService.setIsLoading(false);
        this.snackBar.open(
          `Invite from ${invite.from.username} rejected`,
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  receiveInvite(invite: Invite): Observable<Invite> {
    this.receivedInviteAudio.play();
    this.inviteStateService.setIsLoading(true);
    this.inviteStateService.addInboundInvite(invite);
    this.inviteStateService.setIsLoading(false);
    this.snackBar.open(
      `${invite.from.username} sent you a ${invite.type} invite!`,
      'Dismiss',
      { duration: 5000 }
    );

    return of(invite);
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.inviteStateService.setIsLoading(false);
    return of(null);
  };
}
