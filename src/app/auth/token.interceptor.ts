import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, switchMap } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authSrv: AuthService) { }

  newrequest!: HttpRequest<any>;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authSrv.userSub$.pipe(
      take(1),
      switchMap(myUser => {
        if (!myUser) {
          console.log(request);
          return next.handle(request);

        }
        this.newrequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${myUser.accessToken}`)
        });

        console.log(request);
        console.log(this.newrequest);
        return next.handle(this.newrequest)


      })
    )
  }
}
