import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';

import { Component } from '@angular/core';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-edit-button',
  standalone: true,
  imports: [],
  templateUrl: './edit-button.component.html',
  styleUrl: './edit-button.component.css'
})
export class EditButtonComponent implements ICellRendererAngularComp  {

  params: any;

  constructor(private router: Router, private dataServ: DataService) {
    this.params = null;
  }
  
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  onClick() {
    this.router.navigate(['car', this.params.data.id]);
  }
  
  refresh(params: ICellRendererParams) {
    return true;
  }
}