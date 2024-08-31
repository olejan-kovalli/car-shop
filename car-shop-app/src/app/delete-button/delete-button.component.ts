import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';

import { Component } from '@angular/core';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.css'
})
export class DeleteButtonComponent implements ICellRendererAngularComp  {

  params: any;

  constructor(private router: Router, private dataServ: DataService) {
    this.params = null;
  }
  
  agInit(params: ICellRendererParams): void {
      this.params = params;
  }

  onClick() {
    this.dataServ.deleteCar(this.params.data.Id).subscribe(()=>{
      console.log('deleting', this.params.data.Id)
      this.dataServ.raiseCarDeletedEvent();
    });
  }
  
  refresh(params: ICellRendererParams) {
      return true;
  }
}