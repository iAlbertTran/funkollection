import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface FunkoPop {
  name: string;
  series: string;
  category: string;
  number: any;
}

@Injectable()
export class FunkoPopService {
  constructor(private http: HttpClient) {}

  getAllFunkoPops(): Observable<FunkoPop[]> {
    return this.http.get<FunkoPop[]>('http://localhost:8000/api/funkopop');
  }

  getFunkoPop(name: string): Observable<FunkoPop> {
    return this.http.get<FunkoPop>('http://localhost:8000/api/funkopop/' + name);
  }

  insertFunkoPop(funkopop: FunkoPop): Observable<FunkoPop> {
    return this.http.post<FunkoPop>('http://localhost:8000/api/funkopop/', funkopop);
  }

  updateFunkoPop(funkopop: FunkoPop): Observable<void> {
    return this.http.put<void>('http://localhost:8000/api/funkopop/' + funkopop.name, funkopop);
  }

  deleteFunkoPop(name: string) {
    return this.http.delete('http://localhost:8000/api/funkopop/' + name);
  }
}