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
  @Output() verDetalle = new EventEmitter<void>();
  @Output() toggleFavorita = new EventEmitter<Event>();
  @Output() abrirEnlace = new EventEmitter<string>();
  

  onVerDetalle() {
    this.verDetalle.emit();
  }
  onToggleFavorita(event: Event) {
    event.stopPropagation();  
    this.toggleFavorita.emit(event);
  }

  onAbrirEnlace(url: string) {
    this.abrirEnlace.emit(url);
  } 

}
