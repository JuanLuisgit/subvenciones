import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // 🔥 Importar map
import { Convocatoria } from '../models/convocatoria.model';


@Injectable({ providedIn: 'root' })
export class ConvocatoriaService {
  private apiUrl = '/bdnstrans/api/convocatorias';
  private useMock = false; // Cambiar a false cuando tengas acceso real

  constructor(
    private http: HttpClient,
   
  ) {}

  getConvocatorias(params?: any): Observable<any> {

    const defaultParams = {
      page: 0,
      pageSize: 20,
      order: 'fechaRecepcion',
      direccion: 'desc',
      fechaDesde: '01/01/2023',
      fechaHasta: '31/12/2025',    
      //vpd: 'GE',
      plazo: '',
      estado: '',
      ambito: '',
      organismo: '',
      tipo: '',
      ...params
    };

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) defaultParams[key] = params[key];
      });
    }

    return this.http.get<any>(`${this.apiUrl}/busqueda`, { params: defaultParams }).pipe(
      map(response => this.addEstadoAbierto(response)) // 🔥 Aplicar transformación
    );
  }

 

  /** 🔹 Añade propiedad `abierto` a todas las convocatorias (formato europeo DD/MM/YYYY) */
  public addEstadoAbierto(response: any) {
    if (!response || !response.content) return response;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día

    response.content = response.content.map((c: any) => {
      const inicio = c.fechaInicioSolicitud ? this.parseEuropeanDate(c.fechaInicioSolicitud) : null;
      const fin = c.fechaFinSolicitud ? this.parseEuropeanDate(c.fechaFinSolicitud) : null;

      // Para el último día, considerar hasta las 23:59:59
      if (fin) {
        fin.setHours(23, 59, 59, 999);
      }

      const abierto = inicio && fin ? hoy >= inicio && hoy <= fin : false;

      return { ...c, abierto };
    });

    return response;
  }

  /** 🔹 Para una sola convocatoria */
  public addEstadoSingle(convocatoria: Convocatoria) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicio = convocatoria.fechaInicioSolicitud ? 
      this.parseEuropeanDate(convocatoria.fechaInicioSolicitud) : null;
    
    const fin = convocatoria.fechaFinSolicitud ? 
      this.parseEuropeanDate(convocatoria.fechaFinSolicitud) : null;

    if (fin) {
      fin.setHours(23, 59, 59, 999);
    }

    const abierto = inicio && fin ? hoy >= inicio && hoy <= fin : false;

    return { ...convocatoria, abierto };
  }

  /** 🔹 Parsear fechas en formato europeo DD/MM/YYYY */
  private parseEuropeanDate(dateString: string): Date {
    if (!dateString) return new Date();
    
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Meses en JS son 0-11
      const year = parseInt(parts[2], 10);
      
      return new Date(year, month, day);
    }
    
    // Fallback: intentar parsear como fecha ISO
    return new Date(dateString);
  }
}