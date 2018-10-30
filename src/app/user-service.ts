import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  public isUserLoggedIn;
  
  constructor() {
    this.isUserLoggedIn = false;
    localStorage.setItem('login',this.isUserLoggedIn);
  }

  setUserLoggedIn() {
    this.isUserLoggedIn = true;
    localStorage.setItem('login',this.isUserLoggedIn);
  }
  getUserLoggedIn() {
    return (localStorage.getItem('login') != null ? localStorage.getItem('login') : false);
  }
  setUserLoggedOut() {
    this.isUserLoggedIn = false;
    localStorage.setItem('login',this.isUserLoggedIn);
  }
}