import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from './models/loginModel';
import { FunkollectionApiService } from './services/funkollection-api.service';
@Injectable()
export class AuthService {
  constructor(private myRoute: Router, private _loginModel: LoginModel, private _apiService: FunkollectionApiService) { }

  sendLoginToken(user: string) {
    sessionStorage.setItem("LoggedInUser", user)
  }

  sendAccessToken(token: string){
    sessionStorage.setItem("access_token", token);
    console.log(this.getAccessToken());
  }

  getLoginToken() {
    return sessionStorage.getItem("LoggedInUser")
  }

  getAccessToken() {
    return sessionStorage.getItem("access_token")
  }

  isLoggednIn() {
    return this.getLoginToken() !== null;
  }

  endSession(){
    sessionStorage.removeItem("LoggedInUser");
    sessionStorage.removeItem("access_token");
    this.myRoute.navigate(["/login"]);
  }

  logout() {
    return this._apiService.logoutUser();
  }

  login(_loginModel : LoginModel){
    return this._apiService.loginUser(_loginModel);
  }
}