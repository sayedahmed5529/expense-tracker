import { Injectable } from '@angular/core';
import { AuthCredentials } from '../interfaces/auth-credentials';
import { Router } from '@angular/router';
import { delay, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  constructor(private router: Router) { }

  login(credentials: AuthCredentials) {
    // Simulated API call
    if (credentials.email === 'admin@example.com' && credentials.password === '123456') {
      return of({ token: 'fake-jwt-token', user: { email: credentials.email } }).pipe(
        delay(1000),
        tap(() => {
          this.isLoggedIn = true;
          localStorage.setItem('token', 'fake-jwt-token');
        })
      );
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  get isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('token');
  }
}
