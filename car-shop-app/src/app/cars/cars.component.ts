import { Component, OnInit, ViewChild } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from '../_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AutoWidthCalculator, GridOptions } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { CustomButtonComponent } from "../custom-button/custom-button.component";
import { Car } from '../car';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [AgGridAngular, CustomButtonComponent],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css'
})
export class CarsComponent {
  
  @ViewChild('table') table: any;

  gridOptions: any;
  columnDefs: any;
  rowData: any;

  constructor(private http: HttpClient, private dataServ: DataService, private router: Router) {    
    //this.gridOptions = <GridOptions>{
    //  onGridReady: (event) => {
        //event.api.sizeColumnsToFit();
    //  }
    // }
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
    this.dataServ.getData().subscribe(data => {
        this.defineColumns(data);
        this.fillRows(data);
    });
  }

  defineColumns(data: any) {
    this.columnDefs = [];

    for(const propName of Object.keys(new Car()))
      this.columnDefs.push({ field: propName });

    this.columnDefs.push({ field: "edit", headerName: "Edit", cellRenderer: CustomButtonComponent, width: 150, cellRendererParams: { label: 'edit' }})
    this.columnDefs.push({ field: "delete", headerName: "Delete", cellRenderer: CustomButtonComponent, width: 150, cellRendererParams: { label: 'delete' }})
    
    this.columnDefs[0].hide = true;

    this.columnDefs.forEach((col: any)  => {
      col['resizable'] = true;
      col['type'] = 'rightAligned';
      col['width'] = 150;
    });
  }

  fillRows(data: any) {
    this.rowData = []
    for (var i = 0; i < data.length; i++) {   
      var row: any = {};
      
      for(var j=0; j<this.columnDefs.length;j++)
        row[this.columnDefs[j].field] = data[i][this.columnDefs[j].field];

      this.rowData.push(row);   
    }
  }
}
