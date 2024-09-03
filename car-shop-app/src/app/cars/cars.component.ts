import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { Car } from '../car';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [AgGridAngular, CustomButtonComponent],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css'
})
export class CarsComponent implements OnInit, OnDestroy {
  
  @ViewChild('table') table: any;

  deleteSubscription: Subscription = new Subscription(undefined);

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
    
    this.columnDefs.push({ 
      field: "edit", 
      headerName: "Редактировать", 
      cellRenderer: CustomButtonComponent, 
      cellRendererParams: {onClick: this.onEditClick.bind(this), icon: "bi bi-pencil"}, 
      width: 150 })
    
    this.columnDefs.push({ 
      field: "delete", 
      headerName: "Удалить", 
      cellRenderer: CustomButtonComponent, 
      cellRendererParams: {onClick: this.onDeleteClick.bind(this), icon: "bi bi-trash"}, 
      width: 150
    })
    
    this.columnDefs[0].hide = true;

    this.columnDefs.forEach((col: any)  => {
      col['resizable'] = true;
      col['type'] = 'rightAligned';
      col['width'] = 150;
    });
  }

  onEditClick(id: number) {
    this.router.navigate(['car', id]);
  }

  onDeleteClick(id: number) {
    this.dataServ.deleteCar(id).subscribe(() => {
      this.refreshTable();
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

  ngOnDestroy(): void {
  }
}
