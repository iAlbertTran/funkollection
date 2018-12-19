import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router'; // Router
import { AuthService } from '../auth.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: []
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private _helperService: HelperService, private _route: Router){}
  title = 'funkollection';
  isLoggedIn: boolean = false;
  showMenu: boolean = false;

  private previousPath: string = ''

  ngOnInit(){
    this.isLoggedIn = this.authService.isLoggednIn();
  }

  showMenuDrawer(){
    this.showMenu = true;
  }

  closeMenuDrawer(){
    this.showMenu = false;
  }

  logout(){
    
    this._helperService.removeAllErrors();

    this.authService.logout()
      .subscribe(
        res => { 
          if(res["statusCode"] == 200){
            this.authService.endSession();
          }
        },
        err => {
          alert('unable to log out');
      });

  }
}
