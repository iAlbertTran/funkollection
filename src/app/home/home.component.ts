import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router'; // Router
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private _route: Router){}
  title = 'funkollection';
  isLoggedIn: boolean = false;
  showMenu: boolean = false;

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
    this.authService.logout();

  }

}
