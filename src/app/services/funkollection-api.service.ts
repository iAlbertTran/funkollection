import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FunkoPop } from '../models/funkopop';

import { RegisterModel } from '../models/register';
import { Series } from '../models/Series';
import { Category } from '../models/category';

import { HttpHeaders } from '@angular/common/http';

import { LoginModel } from '../models/loginModel';

import { AuthService } from '../auth.service';


@Injectable()
export class FunkollectionApiService {

  baseURL = 'http://localhost:8000/api';
  funkopopURL = this.baseURL + '/funkopop';


  constructor(private http: HttpClient) {
  }

  getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return headers;
  }

  getAuthHeadersWithToken(): HttpHeaders {

    var token = this.getAccessToken();
    console.log(token);
  
    let headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return headers;
  }

  getUploadAuthHeaders(): HttpHeaders {

    var token = this.getAccessToken();

    let headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`
    });
    
    return headers;
  }

  getLoginAuthHeaders(): HttpHeaders {
		let headers = new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded"});

    
    return headers;
  }


  getAccessToken() {
    return sessionStorage.getItem("access_token")
  }



  getAllFunkoPops(){
    return this.http.get(`${this.funkopopURL}`);
  }

  getFunkoPop(name: string){
    return this.http.get(`${this.funkopopURL}/name`);
  }

  insertFunkoPop(funkopop: FunkoPop){
    return this.http.post(`${this.funkopopURL}`, funkopop);
  }

  uploadFunkoPop(funkopop: FormData) {

    var api_headers = this.getUploadAuthHeaders();

    console.log(api_headers);
    return this.http.post(`${this.funkopopURL}/upload/new`, funkopop, { headers: api_headers });
  }

  deleteFunkoPop(name: string) {
    return this.http.delete(`${this.funkopopURL}/name`);
  }

  getSeries (): Observable<Series[]> {
    return this.http.get<Series[]>(`${this.baseURL}/series`)
      .pipe();
  }

  getCategories (): Observable<Series[]> {
    return this.http.get<Category[]>(`${this.baseURL}/category`)
      .pipe();
  }




  checkAvailableEmail( _email: String ){

    let api_headers = this.getAuthHeaders();
    return this.http.post(`${this.baseURL}/account/isEmailRegistered`, {email: _email}, { headers: api_headers});
  }

  checkAvailableUsername( _username: String ){

    let api_headers = this.getAuthHeaders();

    return this.http.post(`${this.baseURL}/account/isUsernameRegistered`, {username: _username}, { headers: api_headers});
  }

  registerUser( _registerModel: RegisterModel ){
    let api_headers = this.getAuthHeaders();

    return this.http.post(`${this.baseURL}/account/register`, _registerModel, { headers: api_headers});
  }

  loginUser( _loginModel: LoginModel ){

    let api_headers = this.getLoginAuthHeaders();
    let formencoded = `username=${_loginModel.username}&password=${_loginModel.password}`;

    return this.http.post(`${this.baseURL}/account/login`, formencoded, {headers: api_headers});
  }

  logoutUser(){
    let api_headers = this.getAuthHeadersWithToken();
    return this.http.post(`${this.baseURL}/account/logout`, null, {headers: api_headers});
  }
  
}