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
}
