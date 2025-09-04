import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ConvocatoriaService } from '../services/convocatoria.service';
import { Convocatoria } from '../models/convocatoria.model';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css'],
  imports: [FormsModule, CommonModule]
})
export class FiltrosComponent implements OnChanges {

  // mismo shape que usa AppComponent
  filtros = {
    keyword: '',
    administracion: '',
    sector: '',
    estado: '',
    fecha: ''
  };

  /*  Inputs que recibe del padre  */
  @Input() administraciones: string[] = [];
  @Input() sectores: string[] = [];
  @Input() filters!: typeof this.filtros;   // valores iniciales / tras limpiar

  /*  Outputs que el padre espera  */
  @Output() aplicarFiltros = new EventEmitter<typeof this.filtros>();
  @Output() limpiarFiltros = new EventEmitter<void>();

  ngOnChanges(): void {
    // sincroniza cuando el padre resetea filters
    if (this.filters) this.filtros = { ...this.filters };
  }

  /*  emite valores al padre  */
  onAplicar(): void {
    this.aplicarFiltros.emit(this.filtros);
    
    
  }

  onLimpiar(): void {
    this.filtros = {
      keyword: '',
      administracion: '',
      sector: '',
      estado: '',
      fecha: ''
    };
    this.limpiarFiltros.emit();


  }
}


  

