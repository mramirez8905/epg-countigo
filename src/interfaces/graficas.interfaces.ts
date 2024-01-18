export interface IGrafica {
  nombre: string;
  descripcion: string;
  url: string;
  variable_de_graficas: {
    data: any;
  };
  creadoPor: string | number;
  modificadoPor: string | number;
  media: string | number;
}

export interface IGraficaResponse {
  id: number;
  attributes: IGrafica;
}
