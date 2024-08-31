import { Component, OnInit, ViewChild } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from './_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AutoWidthCalculator, GridOptions } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { EditButtonComponent } from "./edit-button/edit-button.component";
import { DeleteButtonComponent } from './delete-button/delete-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular, EditButtonComponent, DeleteButtonComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'car-shop-app';
}
