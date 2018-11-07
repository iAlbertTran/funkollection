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

  emailTaken: boolean = false;
  userNameTaken: boolean = false;

  constructor(private _registerModel: RegisterModel, private _apiService: FunkollectionApiService) { 
  }

  ngOnInit() {
  }

  finishStepOne(){

    this._apiService.checkAvailableEmail(this.email)
      .subscribe(
        res => {
          if(res["statusCode"] == 200){
            this.emailTaken = false;
            this.stepOneComplete = true;
            this.goBackToStepOne = false;

            setTimeout(() =>{
              this.startStepTwo = true;
            }, 500);
          }
          
        },
        err => { 
          if(err.error.statusCode == 409){
            this.emailTaken = true;
          }
          else{
            alert("Unable to check availability of email. Please try again later.")
          }
        }   
    );

    
  }

  finishStepTwo(){

    this._apiService.checkAvailableUsername(this.username)
      .subscribe(
        res => {
          if(res["statusCode"] == 200){
            this.userNameTaken = false;
            this.stepTwoComplete = true;
            this.goBackToStepTwo = false;

            setTimeout(() =>{
              this.startStepThree = true;
            }, 500);
          }
          
        },
        err => { 
          if(err.error.statusCode == 409){
            this.userNameTaken = true;
          }
          else{
            alert("Unable to check availability of username. Please try again later.")
          }
        }   
    );
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
