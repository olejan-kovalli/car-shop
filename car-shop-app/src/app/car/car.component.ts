import { Component } from '@angular/core';
import { Car } from '../car';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})

export class CarComponent {

  id!: string;
  car: any = new Car();

  constructor(private router: Router, private ar: ActivatedRoute, private dataServ: DataService) {
    
    this.id = this.ar.snapshot.params['id'];

    if (this.id === 'new'){
      this.car.make = 'Lada'
      this.car.model = 'Granta'
      this.car.color = 'Green'
      this.car.volume = '1600'
      this.car.mileage = '200000'
      this.car.year = '2000' 
    }
    else
      this.dataServ.getCar(this.id).subscribe(data => {
        if (data) {
          this.car = data;
        console.log(this.car);        
        }
      });
  }

  onSubmit() {
    if (this.id === 'new') {
      this.dataServ.postCar(this.car).subscribe(()=>{
        this.router.navigate(['']);
      });
    }
    else {
      this.dataServ.putCar(this.id, this.car).subscribe(()=>{
        this.router.navigate(['']);
      });
    }
  }
}
