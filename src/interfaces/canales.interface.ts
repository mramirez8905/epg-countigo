import { IInstitucionesResponse } from './instituciones.interface';
import { IPlayListResponse } from './playlist.interface';
import { IServidoresResponse } from './servidores.interface';

export interface ICanal {
  nombre: string;
  descripcion: string;
  disponible: boolean;
  activo: boolean;
  estado: string;
  servidor: {
    data: IServidoresResponse;
  };
  institucion: {
    data: IInstitucionesResponse;
  };
  grupos: {
    data: any;
  };
  numero: number;
  hostSTREAM: string;
  portSTREAM: string;
  format: string;
  vcodec: string;
  crf: string;
  tune: string;
  preset: string;
  vf_scaleH: string;
  vf_scaleV: string;
  streaming: boolean;
  playlists: {
    data: IPlayListResponse[]
  }
}

export interface ICanalResponse {
  id: number;
  attributes: ICanal;
}
