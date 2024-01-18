export interface IInstituciones {
  nombre: string;
  descripcion: string;
  creadoPor: string | number;
  modificadoPor: string | number;
  Activa: boolean;
}

export interface IInstitucionesResponse {
  id: number;
  attributes: IInstituciones;
}
