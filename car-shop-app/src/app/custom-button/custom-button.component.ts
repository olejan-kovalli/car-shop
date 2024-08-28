import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Component } from '@angular/core';

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
  
  label!: string;
  //onClick!: () => void;
  
  params: any

  agInit(params: CustomButtonParams): void {
      this.label = params.label;
      //this.onClick = params.onClick;
      this.params = params;
  }

  onClick() {
    console.log(this.params)
  }
  
  refresh(params: CustomButtonParams) {
      return true;
  }
}
