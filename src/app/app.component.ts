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
    pageSize: this.paginaSize,
    keyword: this.filters.keyword,
    organismo: this.filters.administracion,
    estado: this.filters.estado,
    fechaDesde: this.filters.fecha ? this.filters.fecha : '01/01/2023',
    sector: this.filters.sector
  }).subscribe({
    next: (data) => {
      this.convocatorias = data.content || [];
      this.convocatoriasFiltradas = [...this.convocatorias];
      this.totalPaginas = data.totalPages || 1;
      this.paginaActual = data.number || 0;

      // cargar administraciones y sectores únicos
      this.administraciones = Array.from(new Set(
        this.convocatorias.map(c => c.organo?.nivel2).filter(Boolean)
      ));
      this.sectores = Array.from(new Set(
        this.convocatorias.flatMap(c => c.sectores?.map(s => s.descripcion) || []).filter(Boolean)
      ));
      console.log(this.convocatorias);
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
      this.convocatoriasFiltradas = this.convocatorias.filter(convocatoria => {
        let cumpleFiltro = true;
        // Filtro por palabra clave
        if (this.filters.keyword) {
          const keyword = this.filters.keyword.toLowerCase();
          cumpleFiltro = cumpleFiltro && (
            convocatoria.descripcion?.toLowerCase().includes(keyword) ||
            convocatoria.organo?.nivel2?.toLowerCase().includes(keyword) ||
            convocatoria.sectores?.some(s => s.descripcion.toLowerCase().includes(keyword))
          );
        }
        // Filtro por administración
        if (this.filters.administracion) {
          cumpleFiltro = cumpleFiltro && (convocatoria.organo?.nivel2 === this.filters.administracion);
        }
        // Filtro por sector
        if (this.filters.sector) {
          cumpleFiltro = cumpleFiltro && convocatoria.sectores?.some(s => s.descripcion === this.filters.sector);
        }
        // Filtro por estado
          // if (this.filters.estado) {
          //   if (this.filters.estado === 'abierta') {
          //     cumpleFiltro = cumpleFiltro && convocatoria.abierto === true;
          //   } else if (this.filters.estado === 'cerrada') {
          //     cumpleFiltro = cumpleFiltro && convocatoria.abierto === false;
          //   }
          // }

        
        // Filtro por fecha de publicación
        if (this.filters.fecha) {
          cumpleFiltro = cumpleFiltro && convocatoria?.fechaRecepcion?.startsWith(this.filters.fecha);
        }
        return cumpleFiltro;
      });
      this.ordenarConvocatorias();
      this.cargando = false;
    }, 500);
  }
    aplicarFiltrosDesdeHijo(filtros: any) {
    this.filters = filtros;  // 🔄 sincroniza con el estado del padre
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
    switch(this.orden) {
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
      // Aquí normalmente haríamos una llamada al backend
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
  this.cargarConvocatorias(nuevaPag);   // llama a la API con la nueva página
}
}
