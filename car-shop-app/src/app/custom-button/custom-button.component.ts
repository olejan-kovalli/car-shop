import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';

import { Component } from '@angular/core';
import { DataService } from '../_services/data.service';

interface CustomButtonParams extends ICellRendererParams {
  label: string;
  onClick: () => void;
}

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css'
})
export class CustomButtonComponent implements ICellRendererAngularComp  {

  constructor(private router: Router, private dataServ: DataService) {

  }
  
  label!: string;   
  params: any

  agInit(params: CustomButtonParams): void {
      this.label = params.label;
      this.params = params;
  }

  onClick() {
    if (this.label === 'edit')
      this.router.navigate(['car', this.params.data.id]);
    else
      this.dataServ.deleteCar(this.params.data.id).subscribe(()=>{
        console.log('deleting', this.params.data.id)
        this.dataServ.raiseCarDeletedEvent();
      });
  }
  
  refresh(params: CustomButtonParams) {
      return true;
  }
}