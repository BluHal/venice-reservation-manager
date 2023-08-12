import { Injectable, inject } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import {
  provideAuth,
  getAuth,
  Auth,
  signInWithPopup,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor(private router: Router, private sharedService: SharedService) {}
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  async AuthLogin(provider: GoogleAuthProvider) {
    this.sharedService.activateSpinner();
    try {
      const result_1 = await signInWithPopup(this.auth, provider);
      this.SetUserData(result_1.user);
      this.router.navigateByUrl('/home').then(() => {
        this.sharedService.disableSpinner();
      });
    } catch (error) {
      console.error(error);
      this.sharedService.disableSpinner();
    }
  }

  SetUserData(userData: User) {
    localStorage.setItem('user', JSON.stringify(userData));
    JSON.parse(localStorage.getItem('user')!);
  }
}
