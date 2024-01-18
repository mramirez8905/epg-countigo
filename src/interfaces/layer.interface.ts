import { ICanal, ICanalResponse } from './canales.interface';
import { IInstitucionesResponse } from './instituciones.interface';
import { IMediasCollectionResponse } from './medias.interface';
import { IPlayListResponse } from './playlist.interface';

export interface ILayer {
  nombre: string;
  duracion: string;
  enUso: boolean;
  canal: {
    data: ICanalResponse
  };
  institucion: {
    data: IInstitucionesResponse
  };
  coleccion_de_medias: {
    data: IMediasCollectionResponse[]
  };
  reutilizable: boolean;
}



export interface ILayerResponse {
  id: number;
  attributes: ILayer;
}

export interface ILayerCollectionRequest {
  orden: number;
  layer: number;
  playlist: number;
}

export interface ILayerCollection {
  orden: number;
  layer: {
    data : ILayerResponse
  };
  playlist: {
    data: IPlayListResponse
  };
}

export interface ILayerCollectionResponse {
  id: number;
  attributes: ILayerCollection;
}

