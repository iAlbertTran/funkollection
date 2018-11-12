import { Component, OnInit } from '@angular/core';

import { FunkollectionApiService } from '../services/funkollection-api.service';

import { RegisterModel } from '../models/register';

import { map } from "rxjs/operators";
import { HelperService } from '../services/helper.service';


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

  emailTakenMessage: String = 'Email is already taken.';
  passwordMatchMessage: String = "Passwords do not match."
  usernameTakenMessage: String = 'Username is already taken.';
  unableToCheckEmailAvailability: String = 'Unable to check availability of email. Please try again later.';
  unableToCheckUsernameAvailability: String = 'Unable to check availability of username. Please try again later.';
  unableToRegisterMessage: String = 'Unable to register user. Please try again later.';

  constructor(private _registerModel: RegisterModel, private _helperService: HelperService, private _apiService: FunkollectionApiService) { 
  }

  ngOnInit() {
  }

  finishStepOne(){

    this._apiService.checkAvailableEmail(this.email)
      .subscribe(
        res => {
          if(res["statusCode"] == 200){

            this._helperService.removeErrorFromMessages(this.emailTakenMessage);

            this.stepOneComplete = true;
            this.goBackToStepOne = false;

            setTimeout(() =>{
              this.startStepTwo = true;
            }, 500);
          }
          
        },
        err => { 
          if(err.error.statusCode == 409){

            this._helperService.addErrorToMessages(this.emailTakenMessage);

          }
          else{
            this._helperService.addErrorToMessages(this.unableToCheckEmailAvailability);
          }
        }   
    );

    
  }

  finishStepTwo(){

    this._apiService.checkAvailableUsername(this.username)
      .subscribe(
        res => {
          if(res["statusCode"] == 200){

            this._helperService.removeErrorFromMessages(this.usernameTakenMessage);
            this.stepTwoComplete = true;
            this.goBackToStepTwo = false;

            setTimeout(() =>{
              this.startStepThree = true;
            }, 500);
          }
          
        },
        err => { 
          if(err.error.statusCode == 409){
            this._helperService.addErrorToMessages(this.usernameTakenMessage);
          }
          else{
            this._helperService.addErrorToMessages(this.unableToCheckUsernameAvailability);
          }
        }   
    );
  }

  checkPassword(){
    if(this.password !== this.verifyPassword){
      this._helperService.addErrorToMessages(this.passwordMatchMessage);
    }
    else{
      this._helperService.removeErrorFromMessages(this.passwordMatchMessage);
    }
  }

  backToStepOne(){
    this._helperService.removeErrorFromMessages(this.usernameTakenMessage);
    
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
          this._helperService.removeErrorFromMessages(this.unableToRegisterMessage);
        },
        err => { 
          this._helperService.addErrorToMessages(this.unableToRegisterMessage);
        }   
    );
  }
}
