import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data';
import { environment } from 'src/environments/environment';

import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper = new JwtHelperService();
  apiUrl = environment.apiUrl;
  private authSubj = new BehaviorSubject<null | AuthData>(null);
  userSub$ = this.authSubj.asObservable();
  user!: AuthData;


  constructor(private http: HttpClient, private router: Router) { }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.apiUrl}login`, data).pipe(tap((logData) => {
      console.log(logData);
      this.authSubj.next(logData);
      this.user = logData;
      console.log(this.user);
      localStorage.setItem('user', JSON.stringify(logData));
      console.log(this.userSub$);
      alert('Login effettuato');
      this.router.navigate(['/']);
    }),
      catchError(this.errors)
    )
  }

  restore() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    const userData: AuthData = JSON.parse(user);
    if (this.jwtHelper.isTokenExpired(userData.accessToken)) {
      this.router.navigate(['/login']);
      return;
    }
    this.authSubj.next(userData);
  }

  register(data: {
    nome: string;
    cognome: string;
    email: string;
    password: string;
  }) {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap(() => {
        this.router.navigate(['/login']), catchError(this.errors);
      })
    );
  }

  logout() {
    this.authSubj.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }



  private errors(err: any) {
    console.log(err);
    switch (err.error) {
      case 'Email already exists':
        return throwError('Email già registrata');
        break;

      case 'Email format is invalid':
        return throwError('Email not valid');
        break;

      case 'Cannot find user':
        return throwError('User does not exist');
        break;

      default:
        return throwError('Callback error');
        break;
    }
  }
}
