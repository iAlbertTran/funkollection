import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FunkoPop } from '../models/funkopop';

import { RegisterModel } from '../models/register';
import { Series } from '../models/Series';

import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class FunkollectionApiService {

  baseURL = 'http://localhost:8000/api';
  funkopopURL = this.baseURL + '/funkopop';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private http: HttpClient) {}

  getAllFunkoPops(){
    return this.http.get(`${this.funkopopURL}`);
  }

  getFunkoPop(name: string){
    return this.http.get(`${this.funkopopURL}/name`);
  }

  insertFunkoPop(funkopop: FunkoPop){
    return this.http.post(`${this.funkopopURL}`, funkopop);
  }

  updateFunkoPop(funkopop: FunkoPop) {
    return this.http.put(`${this.funkopopURL}/${funkopop.name}`, funkopop);
  }

  deleteFunkoPop(name: string) {
    return this.http.delete(`${this.funkopopURL}/name`);
  }

  getSeries (): Observable<Series[]> {
    return this.http.get<Series[]>(`${this.baseURL}/series`)
      .pipe();
  }

  registerUser( _registerModel: RegisterModel ){
    return this.http.post(`${this.baseURL}/account/register`, _registerModel, this.httpOptions);
  }
}