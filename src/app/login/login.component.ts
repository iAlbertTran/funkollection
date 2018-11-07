import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router }      from '@angular/router';
import { LoginModel } from '../models/loginModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginModel]
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router, private _loginModel: LoginModel) { }

  username: string;
  password: string;

  loginFailed: boolean = false;
  
  ngOnInit() {
  }

  login() {
    this._loginModel.username = this.username;
    this._loginModel.password = this.password;

    this.authService.login(this._loginModel);
    console.log(this.authService.isLoggednIn);
    if (this.authService.isLoggednIn()) {
      this.loginFailed = false;
      this.router.navigate([""]);
    }
    else{
      this.loginFailed = true;
    }
  }
 
  logout() {
    this.authService.logout();
  }

}
