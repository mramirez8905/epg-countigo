export interface IServidores {
  nombre: string;
  descripcion: string;
  direccionIp: string;
  puerto: number;
  disponible: boolean;
  creadoPor: string | number;
  modificadoPor: string | number;
}

export interface IServidoresResponse {
  id: number;
  attributes: IServidores;
}
