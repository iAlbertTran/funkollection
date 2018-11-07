import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService){}
  title = 'funkollection';
  isLoggedIn = this.authService.isLoggednIn();
  showMenu: boolean = false;

  showMenuDrawer(){
    this.showMenu = true;
  }

  closeMenuDrawer(){
    this.showMenu = false;
  }
}
