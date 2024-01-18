import { ICanalResponse } from './canales.interface';
import {
  IInstitucionesResponse
} from './instituciones.interface';

export interface IPlayList {
  fechaInicio: string;
  duracion: string;
  fechaFin: string;
  loop: boolean;
  bloqueada: boolean;
  aprobado: boolean;
  fechaAprobacion: string;
  coleccion_de_layers: {
    data: any[];
  };
  canal: { data: ICanalResponse | undefined };
  institucion: {
    data: IInstitucionesResponse | undefined;
  };
  aprobadoPor: string | number;
  creadoPor: string | number;
  modificadoPor: string | number;
  espacios_vacios: {
    data: any[];
  };
}

export interface IPlayListResponse {
  id: number;
  attributes: IPlayList;
}