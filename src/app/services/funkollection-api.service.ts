import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FunkoPop } from '../models/funkopop';

import { RegisterModel } from '../models/register';
import { Series } from '../models/series';
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

    let token = this.getAccessToken();
  
    let headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return headers;
  }

  getAuthTokenHeader(): HttpHeaders {

    let token = this.getAccessToken();
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
    let api_headers = this.getAuthTokenHeader();
    return this.http.get(`${this.funkopopURL}`, { headers: api_headers });
  }

  getRandomFunkoPops(){
    let api_headers = this.getAuthTokenHeader();
    return this.http.get(`${this.funkopopURL}/random`, { headers: api_headers });
  }

  getFunkoPop(series: string, category: string, name: string){
    let api_headers = this.getAuthTokenHeader();
    return this.http.get(`${this.funkopopURL}/${series}/${category}/${name}`, { headers: api_headers });
  }

  getFunkoPopImage(name: String){
    let api_headers = this.getAuthTokenHeader();
    return this.http.get(`${this.funkopopURL}/${name}`, { headers: api_headers });
  }

  getUserFunkoPops(){
    let api_headers = this.getAuthTokenHeader();
    let user = sessionStorage.getItem("LoggedInUser");

    return this.http.get(`${this.funkopopURL}/${user}`, { headers: api_headers });
  }

  insertFunkoPop(funkopop: FunkoPop){
    return this.http.post(`${this.funkopopURL}`, funkopop);
  }

  uploadFunkoPop(funkopop: FormData) {

    let api_headers = this.getAuthTokenHeader();

    return this.http.post(`${this.funkopopURL}/upload`, funkopop, { headers: api_headers });
  }

  deleteFunkoPop(name: string) {
    return this.http.delete(`${this.funkopopURL}/name`);
  }

  getPopsInSeries(series: string): Observable<FunkoPop[]> {

    let auth_headers = this.getAuthHeadersWithToken();
    return this.http.get<FunkoPop[]>(`${this.funkopopURL}/series/${series}`, {headers: auth_headers})
      .pipe();
  }

  getSeries (): Observable<Series[]> {

    let auth_headers = this.getAuthHeadersWithToken();
    return this.http.get<Series[]>(`${this.baseURL}/series`, {headers: auth_headers})
      .pipe();
  }

  addSeries(series: string) {

    let auth_headers = this.getAuthHeadersWithToken();
    return this.http.post(`${this.baseURL}/series`, {series: series}, {headers: auth_headers});
  }

  getPopsInCategory(category: string): Observable<FunkoPop[]> {

    let auth_headers = this.getAuthHeadersWithToken();
    return this.http.get<FunkoPop[]>(`${this.funkopopURL}/category/${category}`, {headers: auth_headers})
      .pipe();
  }

  getCategoriesForSeries(seriesID: string): Observable<Series[]> {

    let auth_headers = this.getAuthHeadersWithToken();

    return this.http.get<Category[]>(`${this.baseURL}/${ seriesID }/categories`, {headers: auth_headers})
      .pipe();
  }

  addCategoryForSeries(seriesID: string, category: string) {

    let auth_headers = this.getAuthHeadersWithToken();
    return this.http.post(`${this.baseURL}/category`, {seriesID: seriesID, category: category}, {headers: auth_headers});
  }

  getUserCollection(){
    let auth_headers = this.getAuthTokenHeader();
    let user = sessionStorage.getItem("LoggedInUser");
    return this.http.get(`${this.baseURL}/users/${user}/collection`, {headers: auth_headers});
  }

  addToCollection(popID: string){
    let auth_headers = this.getAuthTokenHeader();
    let user = sessionStorage.getItem("LoggedInUser");
    return this.http.post(`${this.baseURL}/users/${user}/collection/add/${popID}`, null, {headers: auth_headers});

  }

  removeFromCollection(popID: string){
    let auth_headers = this.getAuthTokenHeader();
    let user = sessionStorage.getItem("LoggedInUser");
    return this.http.delete(`${this.baseURL}/users/${user}/collection/remove/${popID}`, {headers: auth_headers});

  }


  getUserWishlist(){
    let auth_headers = this.getAuthTokenHeader();
    let user = sessionStorage.getItem("LoggedInUser");
    return this.http.get(`${this.baseURL}/users/${user}/wishlist`, {headers: auth_headers});
  }

  addToWishlist(popID: string){
    let auth_headers = this.getAuthTokenHeader();
    let user = sessionStorage.getItem("LoggedInUser");
    return this.http.post(`${this.baseURL}/users/${user}/wishlist/add/${popID}`, null, {headers: auth_headers});

  }

  removeFromWishlist(popID: string){
    let auth_headers = this.getAuthTokenHeader();
    let user = sessionStorage.getItem("LoggedInUser");
    return this.http.delete(`${this.baseURL}/users/${user}/wishlist/remove/${popID}`, {headers: auth_headers});

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