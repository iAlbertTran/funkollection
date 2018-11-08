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
  isLoggedIn: boolean = false;
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggednIn();
    if(this.isLoggedIn){
      this.router.navigate(['Home']);
    }
  }

  login() {
    this._loginModel.username = this.username;
    this._loginModel.password = this.password;

    this.authService.login(this._loginModel)
      .subscribe(
        res => { 
          console.log(res);
          if(res["statusCode"] == 200){
            this.authService.sendToken(this._loginModel.username);
            this.loginFailed = false;
            this.router.navigate([""]);
          }
        },
        err => {
          this.loginFailed = true;
      });
  }
 
  logout() {
    this.authService.logout();
  }

}
