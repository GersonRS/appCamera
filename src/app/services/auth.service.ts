import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public ngFireAuth: AngularFireAuth,
  ) {}

  // Login in with email/password
  SignIn(email: string, password: string) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email/password
  RegisterUser(email: string, password: string) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  SignOut() {
    return this.ngFireAuth.signOut();
  }

  getUser() {
    return this.ngFireAuth.user;
  }
}
