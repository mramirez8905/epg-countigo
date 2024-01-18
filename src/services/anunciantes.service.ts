import { IAnunciantes, IAnunciantesResponse } from '@/interfaces/anunciantes.interface';
import { BaseApi } from './base/baseServiceApi';

class AnunciantesService extends BaseApi<IAnunciantesResponse, IAnunciantes> {
  constructor() {
    super('/anunciantes');
  }
}

export const anunciantesService = new AnunciantesService();
