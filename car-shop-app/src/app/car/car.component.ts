import { Component } from '@angular/core';
import { Car } from '../car';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../_services/data.service';
import { NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})

export class CarComponent {

  id!: string;
  car: Car = new Car();

  labels = Car.labels;

  car_found: boolean = false;

  constructor(private router: Router, private ar: ActivatedRoute, private dataServ: DataService) {
    
    this.id = this.ar.snapshot.params['id'];

    if (this.id === 'new'){
      this.car.make = 'Lada'
      this.car.model = 'Granta'
      this.car.color = 'Green'
      this.car.volume = 1600
      this.car.mileage = 200000
      this.car.year = 2000 
    }
    else
      this.dataServ.getCar(this.id).subscribe(data => {
        if (data) {
          this.car = data;
        }
        else {
          this.router.navigate(['notfound']);
        }
      });
  }

  onSubmit() {
    var request = new Observable<any>;

    if (this.id === 'new') 
      request = this.dataServ.postCar(this.car)
    else 
      request = this.dataServ.putCar(this.id, this.car);

    request.subscribe(() => {
      this.router.navigate(['']);
    })
  }
}
