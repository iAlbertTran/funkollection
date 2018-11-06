import { Component, OnInit } from '@angular/core';

import { FunkollectionApiService } from '../services/funkollection-api.service';

import { RegisterModel } from '../models/register';

import { map } from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../assets/css/success.css'],
  providers: [ RegisterModel, FunkollectionApiService ]
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  verifyPassword: string;
  passwordMatch = true;
  stepOneComplete: boolean = false;
  stepTwoComplete: boolean = false;

  goBackToStepOne: boolean = false;
  goBackToStepTwo: boolean = false;

  startStepTwo: boolean = false;
  startStepThree: boolean = false;

  username: string = "";
  firstName: string = "";
  lastName: string = "";

  registerSuccess: boolean = false;
  unableToRegister: boolean = false;


  constructor(private _registerModel: RegisterModel, private _apiService: FunkollectionApiService) { 
  }

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
    console.log(this.password, this.verifyPassword);
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

  submitRegistration(){
    this._registerModel.email = this.email;
    this._registerModel.password = this.password;
    this._registerModel.username = this.username;
    this._registerModel.firstName = this.firstName;
    this._registerModel.lastName = this.lastName;


    this._apiService.registerUser(this._registerModel)
      .subscribe(
        res => {
          this.registerSuccess = true;
        },
        err => { 
          alert("Unable to register user. Please try again later.")
        }   
    );
  }
}
