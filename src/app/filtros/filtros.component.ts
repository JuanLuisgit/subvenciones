import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css'],
  imports: [FormsModule, CommonModule]
})
export class FiltrosComponent {

  filtros: any = {
    estado: '',
    ambito: '',
    organismo: '',
    keyword: '',
    sector: ''
  };

  @Output() filtrosAplicados = new EventEmitter<any>();
  @Output() filtrosLimpiados = new EventEmitter<void>();

  aplicarFiltros() {
    this.filtrosAplicados.emit(this.filtros);
  }

  limpiarFiltros() {
    this.filtros = {
      ambito: '',
      organismo: '',
      keyword: '',
      sector: ''
    };
    this.filtrosLimpiados.emit();
  }
  // 🔹 Paginación
  paginaActual: number = 0;
  totalPaginas: number = 100;

  // 🔹 Inputs que vienen del padre (AppComponent)
  @Input() administraciones: any[] = [];
  @Input() sectores: any[] = [];
  @Input() filters: any = {};

  // 🔹 Outputs (para enviar eventos al padre)
  @Output() filtrosCambiados = new EventEmitter<any>();

  // 🔹 Método de paginación
  cargarConvocatorias(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      console.log('➡️ Pidiendo convocatorias de la página', this.paginaActual);
      this.filtrosCambiados.emit({
        ...this.filters,
        pagina: this.paginaActual
      });
    }
  }
}
