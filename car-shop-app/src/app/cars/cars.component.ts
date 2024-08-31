import { Component, OnInit, ViewChild } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from '../_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AutoWidthCalculator, GridOptions } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface

import { EditButtonComponent } from "../edit-button/edit-button.component";
import { DeleteButtonComponent } from '../delete-button/delete-button.component';
import { Car } from '../car';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [AgGridAngular, EditButtonComponent, DeleteButtonComponent],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css'
})
export class CarsComponent {
  
  @ViewChild('table') table: any;

  gridOptions: any;
  columnDefs: any;
  rowData: any;

  constructor(private http: HttpClient, private dataServ: DataService, private router: Router) {
  }

  onAddClick() {
    this.router.navigate(['car/new']);
  }

  ngOnInit(): void {
    this.refreshTable();
    
    this.dataServ.carDeleted$.subscribe(() => {      
      this.refreshTable();
    });
  }

  refreshTable() {
    this.defineColumns();
    this.dataServ.getData().subscribe(data => {
        this.fillRows(data);
    });
  }

  defineColumns() {
    this.columnDefs = [];

    for(const propName of Object.keys(new Car()))
      this.columnDefs.push({ field: propName, headerName: Car.labels[propName] });

    this.columnDefs.push({ field: "edit", headerName: "Редактировать", cellRenderer: EditButtonComponent, width: 150 })
    this.columnDefs.push({ field: "delete", headerName: "Удалить", cellRenderer: DeleteButtonComponent, width: 150 })
    
    this.columnDefs[0].hide = true;

    this.columnDefs.forEach((col: any)  => {
      col['resizable'] = true;
      col['type'] = 'rightAligned';
      col['width'] = 150;
    });
  }

  fillRows(data: any) {
    this.rowData = []
    for (var row of data) {
      var car = Car.createFromValues(row);
      if (car != undefined)
        this.rowData.push(car);   
    }
  }
}
