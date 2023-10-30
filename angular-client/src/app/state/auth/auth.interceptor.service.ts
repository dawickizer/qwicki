import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  jwt: string;

  constructor(private authService: AuthService) {
    this.authService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.jwt) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${this.jwt}` },
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
