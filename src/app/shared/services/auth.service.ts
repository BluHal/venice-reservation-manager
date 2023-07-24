import { Injectable, inject } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import {
  provideAuth,
  getAuth,
  Auth,
  signInWithPopup,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor() {}
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: GoogleAuthProvider) {
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        this.SetUserData(result.user);
        console.log('You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  SetUserData(userData: User) {
    localStorage.setItem('user', JSON.stringify(userData));
    JSON.parse(localStorage.getItem('user')!);
  }
}
