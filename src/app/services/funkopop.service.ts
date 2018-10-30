import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Series } from '../models/Series';
import { FunkoPop } from '../models/funkopop';

@Injectable()
export class FunkoPopService {

  apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAllFunkoPops(){
    return this.http.get('http://localhost:8000/api/funkopop');
  }

  getFunkoPop(name: string){
    return this.http.get('http://localhost:8000/api/funkopop/' + name);
  }

  insertFunkoPop(funkopop: FunkoPop){
    return this.http.post('http://localhost:8000/api/funkopop/', funkopop);
  }

  updateFunkoPop(funkopop: FunkoPop) {
    return this.http.put('http://localhost:8000/api/funkopop/' + funkopop.name, funkopop);
  }

  deleteFunkoPop(name: string) {
    return this.http.delete('http://localhost:8000/api/funkopop/' + name);
  }

  getSeries (): Observable<Series[]> {
    return this.http.get<Series[]>(`${this.apiUrl}/series`)
      .pipe();
  }
}