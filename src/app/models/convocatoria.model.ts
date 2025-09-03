/**
 * Modelo de datos para una convocatoria de subvención pública en España.
 * Origen de los datos: Intervención General de la Administración del Estado
 * Consulte condiciones legales en https://www.infosubvenciones.es/bdnstrans/GE/es/avisolegal
 */
export interface Convocatoria {
  id: number;
  organo: {
    nivel1: string;
    nivel2: string;
    nivel3: string | null;
  };
  sedeElectronica: string;
  codigoBDNS: string;
  fechaRecepcion: string;
  instrumentos: { descripcion: string }[];
  tipoConvocatoria: string;
  presupuestoTotal: number;
  mrr: boolean;
  descripcion: string;
  descripcionLeng: string;
  tiposBeneficiarios: { descripcion: string }[];
  sectores: { descripcion: string; codigo: string }[];
  regiones: { descripcion: string }[];
  descripcionFinalidad: string;
  descripcionBasesReguladoras: string;
  urlBasesReguladoras: string;
  sePublicaDiarioOficial: boolean;
  fechaInicioSolicitud: string;
  fechaFinSolicitud: string;
  textInicio: string | null;
  textFin: string | null;
  ayudaEstado: string;
  urlAyudaEstado: string;
  fondos: { descripcion: string }[];
  reglamento: {
    descripcion: string;
    orden: string | null;
  };
  objetivos: { descripcion: string }[];
  sectoresProductos: any[];
  documentos: {
    id: number;
    descripcion: string;
    nombreFic: string;
    long: number;
    datMod: string;
    datPublicacion: string;
  }[];
  anuncios: {
    numAnuncio: number;
    titulo: string;
    tituloLeng: string | null;
    texto: string;
    textoLeng: string | null;
    url: string;
    cve: string | null;
    desDiarioOficial: string;
    datPublicacion: string;
  }[];
  advertencia: string;
  favorita?: boolean;
}
