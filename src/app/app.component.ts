import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FiltrosComponent } from './filtros/filtros.component';
import { ConvocatoriaListComponent } from './convocatoria-list/convocatoria-list.component';
import { InfoDestacadaComponent } from './info-destacada/info-destacada.component';
import { FooterComponent } from './footer/footer.component';
import { ConvocatoriaService } from './services/convocatoria.service';
import { Convocatoria } from './models/convocatoria.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, FiltrosComponent, ConvocatoriaListComponent, InfoDestacadaComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'subvenciones';
  convocatorias: Convocatoria[] = [];
  administraciones: string[] = [];
  sectores: string[] = [];
  filters = {
    keyword: "",
    administracion: "",
    sector: "",
    estado: "",
    fecha: ""
  };
  orden = "fechaDesc";
  cargando = true;
  convocatoriasFiltradas: Convocatoria[] = [];
  paginaActual = 0;
  totalPaginas = 0;
  paginaSize = 20;

  constructor(private convocatoriaService: ConvocatoriaService) {
    this.cargarConvocatorias();
  }

  cargarConvocatorias(page: number = 0) {
    this.cargando = true;

    this.convocatoriaService.getConvocatorias({
      page: page,
      pageSize: this.paginaSize
    }).subscribe({
      next: (data) => {
        // Normalizamos datos para filtros y compatibilidad con modelo
        this.convocatorias = data.content.map((c: any) => ({
          ...c,
          sectores: c.sectores || [],
          organo: {
            nivel1: c.nivel1,
            nivel2: c.nivel2,
            nivel3: c.nivel3
          }
        }));

        this.convocatoriasFiltradas = [...this.convocatorias];

        // Rellenamos selects de administración y sector automáticamente
        this.administraciones = Array.from(new Set(this.convocatorias.map(c => c.organo.nivel2).filter(Boolean)));
        this.sectores = Array.from(new Set(
            this.convocatorias.flatMap(c => c.sectores?.map(s => s.descripcion) || [])
          ));

        this.totalPaginas = data.totalPages || 1;
        this.paginaActual = data.number || 0;

        this.ordenarConvocatorias();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar convocatorias', err);
        this.cargando = false;
        this.convocatoriasFiltradas = [];
      }
    });
  }

  aplicarFiltros() {
    this.cargando = true;

    setTimeout(() => {
      this.convocatoriasFiltradas = this.convocatorias.filter(conv => {
        let cumple = true;

        // Filtro por palabra clave
        if (this.filters.keyword) {
          const kw = this.filters.keyword.toLowerCase();
          cumple = cumple && (
            conv.descripcion?.toLowerCase().includes(kw) ||
            conv.organo.nivel2?.toLowerCase().includes(kw) ||
            conv.sectores?.some(s => s.descripcion.toLowerCase().includes(kw))
          );
        }

        // Filtro por administración
        if (this.filters.administracion) {
          cumple = cumple && conv.organo.nivel2 === this.filters.administracion;
        }

        // Filtro por sector
        if (this.filters.sector) {
          cumple = cumple && conv.sectores?.some(s => s.descripcion.toLowerCase() === this.filters.sector.toLowerCase());
        }

        return cumple;
      });

      this.ordenarConvocatorias();
      this.cargando = false;
    }, 50);
  }

  aplicarFiltrosDesdeHijo(filtros: any) {
    this.filters = filtros;  // sincronizamos con el estado del padre
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filters = {
      keyword: "",
      administracion: "",
      sector: "",
      estado: "",
      fecha: ""
    };
    this.convocatoriasFiltradas = [...this.convocatorias];
    this.ordenarConvocatorias();
  }

  ordenarConvocatorias() {
    switch (this.orden) {
      case 'fechaDesc':
        this.convocatoriasFiltradas.sort((a, b) => b.fechaRecepcion.localeCompare(a.fechaRecepcion));
        break;
      case 'fechaAsc':
        this.convocatoriasFiltradas.sort((a, b) => a.fechaRecepcion.localeCompare(b.fechaRecepcion));
        break;
      case 'nombreAsc':
        this.convocatoriasFiltradas.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        break;
      case 'nombreDesc':
        this.convocatoriasFiltradas.sort((a, b) => b.descripcion.localeCompare(a.descripcion));
        break;
    }
  }

  verDetalle(convocatoria: Convocatoria) {
    alert(`Detalle de: ${convocatoria.descripcion}`);
  }

  toggleFavorita(convocatoria: Convocatoria, event: Event) {
    event.stopPropagation();
    convocatoria['favorita'] = !convocatoria['favorita'];
    if (convocatoria['favorita']) {
      console.log(`Añadida a favoritos: ${convocatoria.descripcion}`);
    } else {
      console.log(`Eliminada de favoritos: ${convocatoria.descripcion}`);
    }
  }

  cambiarPagina(nuevaPag: number) {
    if (nuevaPag < 0 || nuevaPag >= this.totalPaginas) return;
    this.paginaActual = nuevaPag;
    this.cargarConvocatorias(nuevaPag);
  }
}
