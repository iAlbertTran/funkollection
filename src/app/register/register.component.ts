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

  goBackToStepOne: Boolean = false;
  goBackToStepTwo: Boolean = false;

  startStepTwo: Boolean = false;
  startStepThree: Boolean = false;

  username: String = "";
  firstName: String = "";
  lastName: String = "";

  constructor() { }

  ngOnInit() {
  }

  finishStepOne(){
    this.stepOneComplete = true;
    this.goBackToStepOne = false;

    setTimeout(() =>{
      this.startStepTwo = true;
    }, 500);
  }

  finishStepTwo(){
    this.stepTwoComplete = true;
    this.goBackToStepTwo = false;

    setTimeout(() =>{
      this.startStepThree = true;
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

  backToStepOne(){
    this.goBackToStepOne = true;
    this.startStepTwo = false;
    this.goBackToStepTwo = false;

    setTimeout(() =>{
      this.stepOneComplete = false;
    }, 500);
  }

  backToStepTwo(){
    this.goBackToStepTwo = true;
    this.startStepThree = false;

    setTimeout(() =>{
      this.stepTwoComplete = false;
    }, 500);
  }
  
}
