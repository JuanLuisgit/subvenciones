import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvocatoriaCardComponent } from '../convocatoria-card/convocatoria-card.component';

@Component({
  selector: 'app-convocatoria-list',
  standalone: true,
  imports: [CommonModule, ConvocatoriaCardComponent],
  templateUrl: './convocatoria-list.component.html',
  styleUrls: ['./convocatoria-list.component.css']
})
export class ConvocatoriaListComponent {
  @Input() convocatoriasFiltradas: any[] = [];
  @Input() cargando: boolean = false;
  @Output() verDetalle = new EventEmitter<any>();
  @Output() toggleFavorita = new EventEmitter<{convocatoria: any, event: Event}>();
  @Input() convocatorias: any[] = [];
  @Output() limpiarFiltros = new EventEmitter<void>();
  @Input() paginaActual: number = 0;
@Input() totalPaginas: number = 0;
@Output() cambiarPagina = new EventEmitter<number>();

/* Helper para mostrar sólo 5 números centrados */
get paginasVisibles(): number[] {
  const total = this.totalPaginas;
  const actual = this.paginaActual;
  const delta = 2;
  const left = Math.max(0, actual - delta);
  const right = Math.min(total - 1, actual + delta);
  return Array.from({ length: right - left + 1 }, (_, i) => left + i);
}
}
