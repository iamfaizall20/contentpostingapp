import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user')!)
  );

  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.value;
  }

  clearUser() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

}
