import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Convocatoria } from '../models/convocatoria.model';

@Component({
  selector: 'app-convocatoria-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convocatoria-card.component.html',
  styleUrls: ['./convocatoria-card.component.css']
})
export class ConvocatoriaCardComponent {
  @Input() convocatoria: Convocatoria | undefined;
  @Output() toggleFavorita = new EventEmitter<Event>();

  onToggleFavorita(event: Event) {
    event.stopPropagation();  
    this.toggleFavorita.emit(event);

  }
  abrirSede(url?: string) {
    if (url) {
      window.open(url,'_blank', 'noopener,noreferrer');
    }
    else{
      console.warn('No hay URL de sede electrónica disponible.');
    }
}
  
}
