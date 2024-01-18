import { ILayerResponse } from './layer.interface';
import { IMeta } from './strapiBase.interface';
export interface IMedias {
  nombre: string;
  descripcion: string;
  tipoMedia: string;
  url: string;
  relleno: boolean;
  aprobado: boolean;
  fechaAprobacion: string;
  identificadorUnico: string;
  publicidad: boolean;
  anunciante: any;
  aprobadoPor: any;
  grafica: any;
  grupos: any;
  institucion: any;
  creadoPor: any;
  modificadoPor: any;
  variable_detalles: any;
  duracion: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy: any;
  updatedBy: any;
}

export interface IMediasResponse {
  id: number;
  attributes: IMedias;
}

export interface IMediasCollection {
  inicio: string;
  duracionMedia: string;
  loop: boolean;
  media: {
    data: IMediasResponse
  };
  layer: {
    data: ILayerResponse
  }
}

export interface IMediasCollectionResponse {
  id: number;
  attributes: IMediasCollection;
}