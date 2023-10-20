import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService {
  constructor(private authService: AuthService) {}

  // do NOT remove route param as it affects angular dep injection and will cause bugs with router logic
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isLoggedIn = await firstValueFrom(this.authService.isLoggedIn());

    if (isLoggedIn) {
      return true;
    } else {
      this.authService
        .logout({
          extras: { queryParams: { return: state.url } },
          makeBackendCall: false,
        })
        .subscribe();
      return false;
    }
  }
}
