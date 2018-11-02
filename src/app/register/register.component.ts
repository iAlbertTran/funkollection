import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: String;
  password: String;
  verifyPassword: String;
  stepCounter: number = 1;
  passwordMatch = true;
  stepOneComplete: Boolean = false;
  stepTwoComplete: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  checkInputFields(){
    this.stepOneComplete = true;
    ++this.stepCounter;
  }

  checkPassword(){
    if(this.password !== this.verifyPassword){
      this.passwordMatch = false;
    }
    else{
      this.passwordMatch = true;
    }
  }
  
}
