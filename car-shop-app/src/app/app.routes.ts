import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CarComponent } from './car/car.component';
import { CarsComponent } from './cars/cars.component';

export const routes: Routes = [
    { path: '', component: CarsComponent },
    { path: 'car', component: CarComponent },
    { path: 'car/:id', component: CarComponent },
];
