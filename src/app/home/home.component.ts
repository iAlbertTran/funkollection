import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import {ActivatedRoute, Router } from '@angular/router'; // Router

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [UserService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.userService.getUserLoggedIn() == false);
    console.log(!this.userService.getUserLoggedIn());
    if( this.userService.getUserLoggedIn() == 'false' ){
      this.router.navigate(['/login']);
    }
  }

}
