import { IMedias } from '@/interfaces/medias.interface';
import { BaseApi } from './base/baseServiceApi';
import { IServidores, IServidoresResponse } from '@/interfaces/servidores.interface';

class ServidoresService extends BaseApi<IServidoresResponse, IServidores> {
  constructor() {
    super('/servidors');
  }
}

export const servidoresService = new ServidoresService();
