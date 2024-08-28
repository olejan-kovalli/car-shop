import { Component, OnInit, ViewChild } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from '../_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AutoWidthCalculator, GridOptions } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { CustomButtonComponent } from "../custom-button/custom-button.component";


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
  data: any;
  columnDefs: any;
  rowData: any;

  constructor(private http: HttpClient, private dataServ: DataService, private router: Router) {    
    this.gridOptions = <GridOptions>{
      onGridReady: (event) => {
        //event.api.sizeColumnsToFit(); 
      }
    }
  }

  onAddClick() {
    console.log('navigating to car');
    this.router.navigate(['car']);
  }

  ngOnInit(): void {
    this.dataServ.getData().subscribe(data => {    
      this.data = data;
      console.log(data);
      this.defineColumns(data);
      this.rowData = [];
      this.updateDisplayedData();    
    });
  }

  defineColumns(data: any) {
    this.columnDefs = [];

    //var indColWidth = 70;
    //var colWidth = 90;

    //this.columnDefs.push({ headerName: '#', valueGetter: "node.rowIndex + 1", width: indColWidth, minWidth: indColWidth, cellStyle: {fontWeight: 'bold'} });      
    //this.columnDefs.push({ headerName: '#', valueGetter: "node.rowIndex + 1", cellStyle: {fontWeight: 'bold'},  });      

    for(const colName of data['feature_names'])
      //this.columnDefs.push({ field: colName, minWidth: colWidth});
      this.columnDefs.push({ field: colName, width: 150 });

    this.columnDefs.push({ field: "edit", headerName: "Edit", cellRenderer: CustomButtonComponent, width: 150, cellRendererParams: { label: 'edit', onClick: this.onEditClick }})
    this.columnDefs.push({ field: "delete", headerName: "Delete", cellRenderer: CustomButtonComponent, width: 150, cellRendererParams: { label: 'delete', onClick: this.onDeleteClick }})
    
    this.columnDefs.forEach((col: any)  => {
      col['resizable'] = true;
      col['type'] = 'rightAligned';
      
    });
  }

  fixedFormatter(params: any) {
    var absVal = Math.abs(params.value);
    if (Math.abs(absVal - Math.round(absVal)) >= 0.05)
      return params.value.toFixed(1);
    else
      return params.value.toFixed();
  }

  rowSelected(event: any){  
  }

  handleRowDataChanged(event: any) {
  }

  updateDisplayedData() {   
    for (var i = 0; i < this.data['data'].length; i++) {   
      var row:any = {};
      
      for (var j = 0; j < this.data.feature_names.length; j++)
        row[this.data['feature_names'][j]] = this.data['data'][i][j];
      console.log(row)
      this.rowData.push(row);   
    } 
    
    //if (this.table)
      //this.table.api.setRowData(this.rowData);
  }

  onEditClick(e:any) {
    this.router.navigate(['car']);
  }

  onDeleteClick() {
    console.log('deleting')
  }
}
