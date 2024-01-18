export interface IPublicSpace {
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaInicio: string;
  duracion: string;
  estado: string;
  aprobado: boolean;
  fechaAprobacion: string;
  institucion: string | number;
  anunciante: string | number;
  media: string | number;
  aprobadoPor: string | number;
  creadoPor: string | number;
  modificadoPor: string | number;
}

export interface IPublicSpaceResponse {
  id: number;
  attributes: IPublicSpace;
}