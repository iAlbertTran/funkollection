import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router }      from '@angular/router';
import { LoginModel } from '../models/loginModel';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginModel]
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, private _helperService: HelperService, public router: Router, private _loginModel: LoginModel) { }

  username: string;
  password: string;

  isLoggedIn: boolean = false;

  loginFailedMessage: String = "Login failed. Please try again.";

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
            this.authService.sendLoginToken(this._loginModel.username);
            this.authService.sendAccessToken(res["token"]);

            this._helperService.removeErrorFromMessages(this.loginFailedMessage);
            
            this.router.navigate([""]);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.loginFailedMessage);
      });
  }
 
  logout() {
    this.authService.logout();
  }

}
