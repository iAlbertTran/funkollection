import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from './models/loginModel';
import { FunkollectionApiService } from './services/funkollection-api.service';
@Injectable()
export class AuthService {
  constructor(private myRoute: Router, private _loginModel: LoginModel, private _apiService: FunkollectionApiService) { }
  sendToken(token: string) {
    localStorage.setItem("LoggedInUser", token)
  }
  getToken() {
    return localStorage.getItem("LoggedInUser")
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.removeItem("LoggedInUser");
    this.myRoute.navigate(["/login"]);
  }

  login(_loginModel : LoginModel){
    return this._apiService.loginUser(_loginModel);
  }
}