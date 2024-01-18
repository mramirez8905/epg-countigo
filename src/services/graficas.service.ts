import { BaseApi } from './base/baseServiceApi';
import { IGrafica, IGraficaResponse } from '@/interfaces/graficas.interfaces';

class GraficasService extends BaseApi<IGraficaResponse, IGrafica> {
  constructor() {
    super('/graficas');
  }
}

export const graficasService = new GraficasService();
