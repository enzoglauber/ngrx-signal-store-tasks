import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  /** Deve ser chamado no app.component ou guard para recuperar user salvo */
  init(): void {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson) as User;
        this._currentUser.set(user);
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .get<User[]>(`http://localhost:3000/users?email=${email}`)
      .pipe(
        map((users) => {
          const user = users[0];
          const fakeToken = `${btoa(email + ':' + password)}`;

          if (user && password === 'password') {
            const response: LoginResponse = {
              accessToken: fakeToken,
              user,
            };

            this.setSession(response);
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  checkAuthStatus(): Observable<boolean> {
    return of(this.hasToken());
  }

  private setSession(response: LoginResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }
    this._currentUser.set(response.user);
  }

  private hasToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
    return false;
  }
}
