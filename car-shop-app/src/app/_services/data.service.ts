import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Car } from '../car';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private backEndUrl = 'https://localhost:7229'
  //private backEndUrl = 'https://localhost:5094'
  
  private _carDeleted: Subject<any>;

  carDeleted$: Observable<any>;

  constructor(private http: HttpClient) { 
    this._carDeleted = new Subject<any>();
    this.carDeleted$ = this._carDeleted.asObservable();
  }

  getData(): Observable<any> {
    return this.http.get(this.backEndUrl + '/cars');
  }

  getCar(id: string): Observable<any> {
    return this.http.get(this.backEndUrl + '/car/'+ id);
  } 

  postCar(car: Car): Observable<any> {
    return this.http.post(this.backEndUrl + '/car', car);
  } 

  putCar(id: string, car: Car): Observable<any> {
    return this.http.put(this.backEndUrl + '/car/' + id, car);
  } 

  deleteCar(id: string): Observable<any> {
    return this.http.delete(this.backEndUrl + '/car/'+ id);
  }

  raiseCarDeletedEvent() {
    this._carDeleted.next("");
  } 
}
