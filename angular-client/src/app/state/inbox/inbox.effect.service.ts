import { Injectable } from '@angular/core';
import { Observable, tap, of, catchError, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Room } from 'colyseus.js';
import { AuthService } from '../auth/auth.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { InboxStateService } from './inbox.state.service';
import { Status } from 'src/app/models/status/status.model';

@Injectable({
  providedIn: 'root',
})
export class InboxEffectService {
  private decodedJwt: DecodedJwt;

  constructor(
    private authService: AuthService,
    private inboxStateService: InboxStateService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToAuthState();
  }

  createInbox(
    inboxId: string,
    options: { jwt: string; status: Partial<Status> }
  ): Observable<Room<any>> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.createRoom(inboxId, options)).pipe(
      tap(this.handleConnectedInboxSuccess),
      catchError(this.handleError)
    );
  }

  connectToInbox(
    inboxId: string,
    options: { jwt: string; status: Partial<Status> }
  ): Observable<Room<any>> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.connectToRoom(inboxId, options)).pipe(
      tap(this.handleConnectedInboxSuccess),
      catchError(this.handleError)
    );
  }

  connectToInboxes(
    inboxIds: string[],
    options: { jwt: string; status: Partial<Status> }
  ): Observable<Room<any>[]> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.connectToRooms(inboxIds, options)).pipe(
      tap(this.handleConnectedInboxesSuccess),
      catchError(this.handleError)
    );
  }

  joinExistingInboxIfPresent(
    inboxId: string,
    options: { jwt: string; status: Partial<Status> }
  ): Observable<Room<any>> {
    this.inboxStateService.setIsLoading(true);
    return from(
      this.colyseusService.joinExistingRoomIfPresent(inboxId, options)
    ).pipe(tap(this.handleConnectedInboxSuccess), catchError(this.handleError));
  }

  joinExistingInboxesIfPresent(
    inboxIds: string[],
    options: { jwt: string; status: Partial<Status> }
  ): Observable<Room<any>[]> {
    this.inboxStateService.setIsLoading(true);
    return from(
      this.colyseusService.joinExistingRoomsIfPresent(inboxIds, options)
    ).pipe(
      tap(this.handleConnectedInboxesSuccess),
      catchError(this.handleError)
    );
  }

  leaveInbox(inbox: Room): Observable<number> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.leaveRoom(inbox)).pipe(
      tap(() => {
        this.inboxStateService.removeConnectedInbox(inbox);
        if (this.isPersonalInbox(inbox.id))
          this.inboxStateService.setPersonalInbox(null);
        this.inboxStateService.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  leaveInboxes(inboxes: Room[]): Observable<number[]> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.leaveRooms(inboxes)).pipe(
      tap(() => {
        this.inboxStateService.removeConnectedInboxes(inboxes);
        if (inboxes.some(inbox => this.isPersonalInbox(inbox.id)))
          this.inboxStateService.setPersonalInbox(null);
        this.inboxStateService.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  private subscribeToAuthState() {
    this.authService.decodedJwt$.subscribe(decodedJwt => {
      this.decodedJwt = decodedJwt;
    });
  }

  private isPersonalInbox(inboxId: string): boolean {
    return inboxId === this.decodedJwt?._id;
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.inboxStateService.setIsLoading(false);
    return of(null);
  };

  private handleConnectedInboxSuccess = (inbox: Room) => {
    if (inbox) {
      this.inboxStateService.addConnectedInbox(inbox);
    }
    this.inboxStateService.setIsLoading(false);
  };

  private handleConnectedInboxesSuccess = (inboxes: Room[]) => {
    if (inboxes.length > 0) {
      this.inboxStateService.addConnectedInboxes([...inboxes]);
    }
    this.inboxStateService.setIsLoading(false);
  };
}
