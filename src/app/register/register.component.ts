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
  passwordMatch = true;
  stepOneComplete: Boolean = false;
  stepTwoComplete: Boolean = false;
  startStepTwo: Boolean = false;
  stepTitle: string = "Create Your Account";
  username: String = "";
  firstName: String = "";
  lastName: String = "";

  constructor() { }

  ngOnInit() {
  }

  checkInputFields(){
    this.stepOneComplete = true;

    setTimeout(() =>{
      this.stepTitle = "Personal Information";
      this.startStepTwo = true;
    }, 500);
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
