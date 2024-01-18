export interface IAnunciantes {
  nombre: string;
  descripcion: string;
  creadoPor: string | number;
  modificadoPor: string | number;
}

export interface IAnunciantesResponse {
  id: number;
  attributes: IAnunciantes;
}
