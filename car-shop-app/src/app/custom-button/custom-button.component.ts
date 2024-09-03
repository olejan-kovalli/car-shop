import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

interface IButtonCellRendererParams extends ICellRendererParams {
  icon: string;
  onClick: (e:any) => void;
}

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css'
})
export class CustomButtonComponent implements ICellRendererAngularComp  {

  id: number = -1;
  icon: string = "";
  onClick!: (id: number) => void;

  constructor(private router: Router) {
  }
  
  agInit(params: IButtonCellRendererParams): void {            
      this.id = params.data.id;
      this.icon = params.icon;
      this.onClick = params.onClick;
  }

  refresh(params: ICellRendererParams) {
      return true;
  }
}