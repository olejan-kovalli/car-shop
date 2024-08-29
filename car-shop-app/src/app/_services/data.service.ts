import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Car } from '../car';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private _carDeleted: Subject<any>;

  carDeleted$: Observable<any>;

  constructor(private http: HttpClient) { 
    this._carDeleted = new Subject<any>();
    this.carDeleted$ = this._carDeleted.asObservable();
  }

  getData(): Observable<any> {
    return this.http.get('https://localhost:7229/cars');
  }

  getCar(id: string): Observable<any> {
    return this.http.get('https://localhost:7229/car/'+ id);
  } 

  postCar(car: Car): Observable<any> {
    return this.http.post('https://localhost:7229/car', car);
  } 

  putCar(id: string, car: Car): Observable<any> {
    return this.http.put('https://localhost:7229/car/' + id, car);
  } 

  deleteCar(id: string): Observable<any> {
    return this.http.delete('https://localhost:7229/car/'+ id);
  }

  raiseCarDeletedEvent() {
    this._carDeleted.next("");
  } 
}
